const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const authUsers = require('../middleware/auth.middleware');

// Create the router instance
const authRoutes = Router();

/**
 * @route POST /api/auth/register
 * @desc Registers a new user with username, email, and password, setting a JWT token in cookies.
 * @access Public
 */
authRoutes.post('/register', authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Authenticates an existing user by matching email and password, setting a JWT token in cookies.
 * @access Public
 */
authRoutes.post('/login', authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @desc Logs out the user by clearing cookie and blacklisting the token.
 * @access Public
 */
authRoutes.get('/logout', authController.logoutUserController);

/**
 * @route GET /api/auth/getme
 * @desc Retrieves the authenticated user profile.
 * @access Private
 */
authRoutes.get('/getme', authUsers, authController.getMeController);

// Export the routes
module.exports = authRoutes;
