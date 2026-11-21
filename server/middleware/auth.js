const jwt = require('jsonwebtoken');
const { usersDB } = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'campusconnect_jwt_secret_key_2026_super_secure';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
    const user = usersDB.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }
    req.user = user;
    next();
  });
}

// Optional auth - populates req.user if token is present, but doesn't block if missing
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.user = usersDB.findById(decoded.id) || null;
    } else {
      req.user = null;
    }
    next();
  });
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: This action requires one of the following roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}` 
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole,
  JWT_SECRET
};
