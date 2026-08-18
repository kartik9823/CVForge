require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/user.routes');
const interviewRoutes = require('./routes/interview.routes');
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);

// Initialize Database Connection
connectDB();

// Basic health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Resume Analyzer Backend API!',
    status: 'Running'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`Local Access: http://localhost:${PORT}`);
});

// Trigger reload - updated auth middleware blacklist check
