const express = require('express');
const router = express.Router();
const {
  usersDB,
  opportunitiesDB,
  applicationsDB,
  ticketsDB,
  eventsDB,
  announcementsDB
} = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/dashboard/stats
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const user = req.user;
    const allOpportunities = opportunitiesDB.read();
    const allTickets = ticketsDB.read();
    const allEvents = eventsDB.read();
    const allAnnouncements = announcementsDB.read();

    if (user.role === 'student') {
      const myApplications = applicationsDB.find(app => app.studentId === user.id);
      const myTickets = allTickets.filter(t => t.reportedBy === user.id);
      const myEvents = allEvents.filter(e => (e.registeredUsers || []).includes(user.id));

      const stats = {
        totalApplications: myApplications.length,
        inReviewApplications: myApplications.filter(a => ['Applied', 'Viewed'].includes(a.status)).length,
        shortlistedCount: myApplications.filter(a => ['Shortlisted', 'Interview'].includes(a.status)).length,
        offersCount: myApplications.filter(a => a.status === 'Offer').length,
        myTicketsCount: myTickets.length,
        registeredEventsCount: myEvents.length,
        profileStrength: user.profileStrength || 75
      };

      res.json({
        success: true,
        role: 'student',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          college: user.college,
          department: user.department,
          avatar: user.avatar,
          skills: user.skills || [],
          profileStrength: user.profileStrength || 75
        },
        stats,
        applications: myApplications,
        tickets: myTickets,
        events: myEvents,
        announcements: allAnnouncements
      });
    } else if (user.role === 'faculty') {
      // Faculty Admin View
      const activeTickets = allTickets.filter(t => t.status !== 'Resolved');
      const resolvedTickets = allTickets.filter(t => t.status === 'Resolved');

      res.json({
        success: true,
        role: 'faculty',
        user,
        stats: {
          totalTickets: allTickets.length,
          activeTicketsCount: activeTickets.length,
          resolvedTicketsCount: resolvedTickets.length,
          totalStudentsCount: usersDB.find(u => u.role === 'student').length,
          slaCompliance: '94%'
        },
        tickets: allTickets,
        announcements: allAnnouncements
      });
    } else {
      // Recruiter View
      const myPostings = allOpportunities.filter(o => o.postedBy === user.id);
      const myOppIds = myPostings.map(o => o.id);
      const incomingApplications = applicationsDB.find(a => myOppIds.includes(a.opportunityId));

      res.json({
        success: true,
        role: 'recruiter',
        user,
        stats: {
          activePostings: myPostings.length,
          totalApplicants: incomingApplications.length,
          shortlistedCount: incomingApplications.filter(a => a.status === 'Shortlisted').length,
          interviewsCount: incomingApplications.filter(a => a.status === 'Interview').length
        },
        postings: myPostings,
        applications: incomingApplications
      });
    }
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ success: false, message: 'Failed to generate dashboard data.' });
  }
});

// GET /api/dashboard/announcements
router.get('/announcements', (req, res) => {
  const announcements = announcementsDB.read();
  res.json({ success: true, data: announcements });
});

module.exports = router;
