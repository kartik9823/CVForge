const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

/**
 * Middleware to authenticate requests using JSON Web Token (JWT).
 * It extracts the token from cookies or the authorization header, verifies it,
 * and attaches the decoded payload to the request object.
 */
const authUsers = async (req, res, next) => {
  try {
    // 1. Get the token from the request cookies or authorization headers
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    // 2. Check if the token exists or not
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized: No token provided'
      });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await tokenBlacklistModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: 'Unauthorized: Token is blacklisted'
      });
    }

    // 3. Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 4. Set the request.user from the decoded payload
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Error in authUsers middleware:', error);
    return res.status(401).json({
      message: 'Unauthorized: Invalid token'
    });
  }
};

module.exports = authUsers;
