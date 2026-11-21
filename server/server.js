require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

const { seedDatabase } = require('./db/seed');

// Routes
const authRoutes = require('./routes/auth');
const opportunitiesRoutes = require('./routes/opportunities');
const campusfixRoutes = require('./routes/campusfix');
const servicesRoutes = require('./routes/services');
const eventsRoutes = require('./routes/events');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload directory exists
const UPLOAD_DIR = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Seed mock data if first run
seedDatabase();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files: Serve uploads and public frontend
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/campusfix', campusfixRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'CampusConnect',
    time: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Fallback route for Single Page navigation
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CampusConnect Portal Server running on http://localhost:${PORT}`);
  console.log(`📡 REST API available at http://localhost:${PORT}/api`);
  console.log(`💻 Frontend served at http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
