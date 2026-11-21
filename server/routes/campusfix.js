const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ticketsDB } = require('../db/database');
const { authenticateToken, optionalAuth, requireRole } = require('../middleware/auth');

// Multer storage for photo attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const VALID_STAGES = ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

// GET /api/campusfix
// Filters: category, status, priority, block, search
router.get('/', optionalAuth, (req, res) => {
  try {
    let tickets = ticketsDB.read();
    const { category, status, priority, block, search } = req.query;

    if (search) {
      const q = search.toLowerCase();
      tickets = tickets.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.block.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      tickets = tickets.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'All') {
      tickets = tickets.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }

    if (priority && priority !== 'All') {
      tickets = tickets.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    }

    if (block && block !== 'All') {
      tickets = tickets.filter(t => t.block.toLowerCase().includes(block.toLowerCase()));
    }

    // Attach user upvote state if logged in
    const userId = req.user?.id;
    tickets = tickets.map(t => ({
      ...t,
      hasUpvoted: userId ? (t.upvotedBy || []).includes(userId) : false
    }));

    // Sort by upvotes desc, then recent
    tickets.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (err) {
    console.error('Error fetching CampusFix tickets:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving tickets.' });
  }
});

// GET /api/campusfix/:id
router.get('/:id', optionalAuth, (req, res) => {
  const ticket = ticketsDB.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found.' });
  }
  const userId = req.user?.id;
  res.json({
    success: true,
    data: {
      ...ticket,
      hasUpvoted: userId ? (ticket.upvotedBy || []).includes(userId) : false
    }
  });
});

// POST /api/campusfix
// Submit new problem report
router.post('/', authenticateToken, upload.single('photo'), (req, res) => {
  try {
    const { title, category, block, campus, priority, description, isAnonymous } = req.body;

    if (!title || !description || !block) {
      return res.status(400).json({ success: false, message: 'Title, location block, and description are required.' });
    }

    const anonymousBool = isAnonymous === 'true' || isAnonymous === true;
    let photoUrl = '';
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const newTicket = ticketsDB.insert({
      title,
      category: category || 'Classroom Infra',
      block,
      campus: campus || 'Main Academic Area',
      priority: priority || 'Medium',
      status: 'Reported',
      statusIndex: 0,
      upvotes: 1,
      upvotedBy: [req.user.id],
      reportedBy: req.user.id,
      reporterName: anonymousBool ? 'Anonymous Student' : req.user.name,
      isAnonymous: anonymousBool,
      description,
      photoUrl,
      timeline: [
        {
          stage: 'Reported',
          timestamp: new Date().toISOString(),
          note: `Issue reported by ${anonymousBool ? 'a student' : req.user.name}. SLA timer initiated.`
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'CampusFix report submitted successfully! Administration has been notified.',
      data: newTicket
    });
  } catch (err) {
    console.error('Error creating CampusFix ticket:', err);
    res.status(500).json({ success: false, message: 'Failed to create ticket.' });
  }
});

// POST /api/campusfix/:id/upvote
router.post('/:id/upvote', authenticateToken, (req, res) => {
  try {
    const ticket = ticketsDB.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    const upvotedBy = ticket.upvotedBy || [];
    const userId = req.user.id;
    let upvotes = ticket.upvotes || 0;
    let hasUpvoted = false;

    if (upvotedBy.includes(userId)) {
      // Toggle off upvote
      const index = upvotedBy.indexOf(userId);
      upvotedBy.splice(index, 1);
      upvotes = Math.max(0, upvotes - 1);
      hasUpvoted = false;
    } else {
      // Add upvote
      upvotedBy.push(userId);
      upvotes += 1;
      hasUpvoted = true;
    }

    const updated = ticketsDB.update(ticket.id, {
      upvotes,
      upvotedBy
    });

    res.json({
      success: true,
      message: hasUpvoted ? 'Upvote registered! Urgency escalated.' : 'Upvote removed.',
      data: {
        id: updated.id,
        upvotes: updated.upvotes,
        hasUpvoted
      }
    });
  } catch (err) {
    console.error('Upvote error:', err);
    res.status(500).json({ success: false, message: 'Failed to register upvote.' });
  }
});

// PATCH /api/campusfix/:id/status (Faculty or Facilities Admin)
router.patch('/:id/status', authenticateToken, requireRole('faculty'), (req, res) => {
  try {
    const { status, note, assignedTo, eta, resolutionProof } = req.body;

    if (!VALID_STAGES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status stage. Allowed values: ${VALID_STAGES.join(', ')}`
      });
    }

    const ticket = ticketsDB.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    const statusIndex = VALID_STAGES.indexOf(status);
    const timeline = ticket.timeline || [];

    timeline.push({
      stage: status,
      timestamp: new Date().toISOString(),
      note: note || `Status progressed to ${status} by ${req.user.name}.`
    });

    const updates = {
      status,
      statusIndex,
      timeline
    };

    if (assignedTo) updates.assignedTo = assignedTo;
    if (eta) updates.eta = eta;
    if (resolutionProof) updates.resolutionProof = resolutionProof;
    if (status === 'Resolved') updates.resolvedAt = new Date().toISOString();

    const updated = ticketsDB.update(ticket.id, updates);

    res.json({
      success: true,
      message: `Ticket #${ticket.id} status updated to ${status}.`,
      data: updated
    });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update ticket status.' });
  }
});

module.exports = router;
