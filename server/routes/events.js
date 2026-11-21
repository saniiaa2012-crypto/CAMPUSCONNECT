const express = require('express');
const router = express.Router();
const { eventsDB } = require('../db/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// GET /api/events
router.get('/', optionalAuth, (req, res) => {
  try {
    let events = eventsDB.read();
    const { category, search } = req.query;

    if (search) {
      const q = search.toLowerCase();
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q) ||
        (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (category && category !== 'All') {
      events = events.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    const userId = req.user?.id;
    events = events.map(e => ({
      ...e,
      isRegistered: userId ? (e.registeredUsers || []).includes(userId) : false
    }));

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch events.' });
  }
});

// POST /api/events/:id/register
router.post('/:id/register', authenticateToken, (req, res) => {
  try {
    const event = eventsDB.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const registeredUsers = event.registeredUsers || [];
    if (registeredUsers.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event!' });
    }

    registeredUsers.push(req.user.id);
    const updated = eventsDB.update(event.id, {
      registeredUsers,
      teamsRegistered: (event.teamsRegistered || 0) + 1
    });

    res.json({
      success: true,
      message: `Successfully registered for "${event.title}"! We've sent details to ${req.user.email}.`,
      data: {
        id: updated.id,
        isRegistered: true,
        teamsRegistered: updated.teamsRegistered
      }
    });
  } catch (err) {
    console.error('Event registration error:', err);
    res.status(500).json({ success: false, message: 'Failed to register for event.' });
  }
});

module.exports = router;
