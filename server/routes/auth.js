const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { usersDB } = require('../db/database');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Helper to remove password hash from user response
function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { name, email, password, role, college, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = usersDB.findOne(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = usersDB.insert({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'student',
      college: college || 'Delhi Technological University (DTU)',
      department: department || 'General Engineering',
      avatar: '/assets/student-portrait.png',
      skills: ['Problem Solving', 'Communication'],
      profileStrength: 60
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = usersDB.findOne(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: sanitizeUser(req.user)
  });
});

// PATCH /api/auth/profile
router.patch('/profile', authenticateToken, (req, res) => {
  try {
    const { name, bio, college, department, skills, phone, resumeUrl } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (college) updates.college = college;
    if (department) updates.department = department;
    if (skills) updates.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (phone) updates.phone = phone;
    if (resumeUrl) updates.resumeUrl = resumeUrl;

    // Recalculate profile strength
    let strength = 40;
    if (updates.bio || req.user.bio) strength += 15;
    if (updates.skills?.length || req.user.skills?.length) strength += 20;
    if (updates.resumeUrl || req.user.resumeUrl) strength += 15;
    if (updates.phone || req.user.phone) strength += 10;
    updates.profileStrength = Math.min(100, strength);

    const updated = usersDB.update(req.user.id, updates);
    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: sanitizeUser(updated)
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// POST /api/auth/switch-demo-persona
// Allows quick switching between demo personas (Student, Faculty Admin, Recruiter)
router.post('/switch-demo-persona', (req, res) => {
  const { personaId } = req.body;
  const user = usersDB.findById(personaId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Demo persona not found.' });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({
    success: true,
    message: `Switched to persona: ${user.name} (${user.role})`,
    token,
    user: sanitizeUser(user)
  });
});

module.exports = router;
