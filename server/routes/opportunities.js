const express = require('express');
const router = express.Router();
const { opportunitiesDB, applicationsDB } = require('../db/database');
const { authenticateToken, optionalAuth, requireRole } = require('../middleware/auth');

// GET /api/opportunities
// Filterable by: search, category, workMode, minStipend, type
router.get('/', optionalAuth, (req, res) => {
  try {
    let results = opportunitiesDB.read();
    const { search, category, workMode, minStipend, type, location } = req.query;

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(opp =>
        opp.title.toLowerCase().includes(q) ||
        opp.company.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        (opp.tags && opp.tags.some(t => t.toLowerCase().includes(q))) ||
        opp.location.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      results = results.filter(opp => opp.category.toLowerCase() === category.toLowerCase());
    }

    if (workMode && workMode !== 'All') {
      results = results.filter(opp => opp.workMode.toLowerCase() === workMode.toLowerCase());
    }

    if (type && type !== 'All') {
      results = results.filter(opp => opp.type.toLowerCase() === type.toLowerCase());
    }

    if (location && location !== 'All') {
      const locQ = location.toLowerCase();
      results = results.filter(opp => opp.location.toLowerCase().includes(locQ));
    }

    if (minStipend) {
      const min = parseInt(minStipend, 10);
      if (!isNaN(min)) {
        results = results.filter(opp => (opp.stipend || 0) >= min);
      }
    }

    // Attach user application status if logged in
    if (req.user) {
      const userApps = applicationsDB.find(app => app.studentId === req.user.id);
      const appMap = new Map(userApps.map(app => [app.opportunityId, app]));
      results = results.map(opp => ({
        ...opp,
        hasApplied: appMap.has(opp.id),
        applicationStatus: appMap.get(opp.id)?.status || null
      }));
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (err) {
    console.error('Error fetching opportunities:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving opportunities.' });
  }
});

// GET /api/opportunities/:id
router.get('/:id', optionalAuth, (req, res) => {
  const opp = opportunitiesDB.findById(req.params.id);
  if (!opp) {
    return res.status(404).json({ success: false, message: 'Opportunity not found.' });
  }

  let userApp = null;
  if (req.user) {
    userApp = applicationsDB.findOne(app => app.opportunityId === opp.id && app.studentId === req.user.id);
  }

  res.json({
    success: true,
    data: {
      ...opp,
      hasApplied: Boolean(userApp),
      applicationStatus: userApp?.status || null
    }
  });
});

// POST /api/opportunities (Recruiter or Faculty)
router.post('/', authenticateToken, requireRole('recruiter', 'faculty'), (req, res) => {
  try {
    const {
      title,
      company,
      location,
      workMode,
      type,
      stipend,
      duration,
      weeklyHours,
      openings,
      deadline,
      category,
      tags,
      description,
      requirements
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const numStipend = parseInt(stipend, 10) || 0;
    const newOpp = opportunitiesDB.insert({
      title,
      company: company || req.user.company || req.user.college,
      companyLogo: req.user.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      verified: true,
      location: location || 'Hybrid',
      workMode: workMode || 'Hybrid',
      type: type || 'Internship',
      stipend: numStipend,
      stipendFormatted: numStipend > 0 ? `₹${numStipend.toLocaleString('en-IN')} / mo` : 'Unpaid / Certificate',
      duration: duration || '3 Months',
      weeklyHours: weeklyHours || '20 hrs/week',
      openings: parseInt(openings, 10) || 1,
      applicantsCount: 0,
      deadline: deadline || '2026-12-31',
      featured: false,
      category: category || 'Software Engineering',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Campus']),
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n').filter(Boolean) : []),
      postedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity posted successfully!',
      data: newOpp
    });
  } catch (err) {
    console.error('Error posting opportunity:', err);
    res.status(500).json({ success: false, message: 'Failed to post opportunity.' });
  }
});

// POST /api/opportunities/:id/apply (Student application)
router.post('/:id/apply', authenticateToken, (req, res) => {
  try {
    const opp = opportunitiesDB.findById(req.params.id);
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    // Check if already applied
    const existing = applicationsDB.findOne(a => a.opportunityId === opp.id && a.studentId === req.user.id);
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already applied for this opportunity!' });
    }

    const { coverNote, portfolioUrl } = req.body;

    const newApplication = applicationsDB.insert({
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      company: opp.company,
      studentId: req.user.id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentCollege: req.user.college,
      status: 'Applied',
      stageIndex: 0, // 0: Applied, 1: Viewed, 2: Shortlisted, 3: Interview, 4: Offer
      stipendFormatted: opp.stipendFormatted,
      appliedAt: new Date().toISOString(),
      coverNote: coverNote || 'Excited to contribute to this role!',
      portfolioUrl: portfolioUrl || req.user.resumeUrl || ''
    });

    // Increment applicants counter
    opportunitiesDB.update(opp.id, {
      applicantsCount: (opp.applicantsCount || 0) + 1
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Track progress on your Dashboard.',
      data: newApplication
    });
  } catch (err) {
    console.error('Application submission error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
});

// GET /api/opportunities/applications/my
router.get('/applications/my', authenticateToken, (req, res) => {
  const userApps = applicationsDB.find(app => app.studentId === req.user.id);
  res.json({
    success: true,
    count: userApps.length,
    data: userApps
  });
});

// PATCH /api/opportunities/applications/:appId/status (Recruiter / Faculty)
router.patch('/applications/:appId/status', authenticateToken, requireRole('recruiter', 'faculty'), (req, res) => {
  const { status, feedback } = req.body;
  const stages = ['Applied', 'Viewed', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];
  if (!stages.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${stages.join(', ')}` });
  }

  const stageIndex = stages.indexOf(status);
  const updated = applicationsDB.update(req.params.appId, {
    status,
    stageIndex,
    feedback: feedback || undefined,
    statusUpdatedAt: new Date().toISOString()
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  res.json({
    success: true,
    message: `Application updated to ${status}.`,
    data: updated
  });
});

module.exports = router;
