require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

const { seedDatabase } = require('./db/seed');

// Route Modules
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

// Seed mock data if not already present
seedDatabase();

// CORS Configuration - Fully supports Cloudflare Pages (*.pages.dev) and custom domains calling Render
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or any origin when CORS_ORIGIN is wildcard
    if (!origin || corsOrigin === '*') {
      return callback(null, true);
    }
    const allowed = corsOrigin.split(',').map(s => s.trim());
    if (allowed.includes(origin) || origin.endsWith('.pages.dev')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static uploads serving (for ticket photo attachments)
app.use('/uploads', express.static(UPLOAD_DIR));

// Root Endpoint - Backend API Service Welcome & Info (No Frontend)
app.get('/', (req, res) => {
  res.json({
    name: 'CampusConnect Backend API',
    status: 'online',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
    message: 'CampusConnect REST API service is running on Render.',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      opportunities: '/api/opportunities',
      campusfix: '/api/campusfix',
      services: '/api/services',
      events: '/api/events',
      dashboard: '/api/dashboard'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/campusfix', campusfixRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint for Render / Uptime monitors
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusConnect Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 Handler for any non-existing endpoint (API only)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CampusConnect BACKEND API running on port ${PORT}`);
  console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
  console.log(`🌐 Mode: BACKEND-ONLY (Render ready)`);
  console.log(`=======================================================`);
});
