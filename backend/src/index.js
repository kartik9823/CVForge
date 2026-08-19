require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/user.routes');
const interviewRoutes = require('./routes/interview.routes');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database Connection
connectDB();

// Dynamic CORS configuration
const frontendUrl = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.replace(/\/$/, '')
  : "http://localhost:5173";

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (
      cleanOrigin === frontendUrl ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('localhost')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Resume Analyzer Backend API!',
    status: 'Running'
  });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log(`Local Access: http://localhost:${PORT}`);
  });
}

module.exports = app;
