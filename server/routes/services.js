const express = require('express');
const router = express.Router();
const { servicesDB } = require('../db/database');
const { optionalAuth } = require('../middleware/auth');

// GET /api/services
router.get('/', optionalAuth, (req, res) => {
  try {
    let services = servicesDB.read();
    const { category, search } = req.query;

    if (search) {
      const q = search.toLowerCase();
      services = services.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.discountBadge.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (err) {
    console.error('Error fetching campus services:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch services.' });
  }
});

// GET /api/services/:id
router.get('/:id', (req, res) => {
  const service = servicesDB.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }
  res.json({ success: true, data: service });
});

module.exports = router;
