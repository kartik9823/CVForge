const mongoose = require('mongoose');
const dns = require('dns');

// Programmatically set DNS servers to bypass local/ISP DNS issues with SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  let mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_analyzer';

  // Automatically URL-encode password if it contains special characters (like '@' or ':')
  if (mongodbUri.startsWith('mongodb+srv://')) {
    const prefix = 'mongodb+srv://';
    const rest = mongodbUri.substring(prefix.length);
    const lastAtIndex = rest.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const credentials = rest.substring(0, lastAtIndex);
      const host = rest.substring(lastAtIndex + 1);
      const colonIndex = credentials.indexOf(':');
      if (colonIndex !== -1) {
        const username = credentials.substring(0, colonIndex);
        const password = credentials.substring(colonIndex + 1);

        // Encode password if it contains special characters that are not already URL-encoded
        if (password.includes('@') || password.includes(':')) {
          const encodedPassword = encodeURIComponent(password);
          mongodbUri = `${prefix}${username}:${encodedPassword}@${host}`;
        }
      }
    }
  }

  try {
    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB database successfully.');
  } catch (err) {
    console.warn('Warning: MongoDB connection failed.');
    console.warn('Ensure MongoDB is installed and running locally.');
    console.warn(err.message);
  }
};

module.exports = connectDB;
