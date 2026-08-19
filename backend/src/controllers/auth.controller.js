const express = require('express');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require('../models/blacklist.model');

/**
 * @route POST /api/auth/register
 * @desc Handles asynchronous user registration
 * @description This controller function manages the initial steps of the user registration process.
 * It validates input fields, queries the database for pre-existing accounts, and prepares
 * the system for final user persistence.
 */
const registerUserController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    // Check if the user already exists in MongoDB
    const existingUser = await User.findOne({
      $or: [
        { email: email?.toLowerCase() },
        { username }
      ]
    });

    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username,
      email: email,
      password: hash
    })


    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    )

    const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    };

    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      message: 'Registration checks passed. Awaiting final creation logic.',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Error in registerUserController:', error);
    return res.status(500).json({
      message: 'Server error occurred during registration'
    });
  }
};

/**
 * @route POST /api/auth/login
 * @desc Handles user login authentication
 * @description This controller function manages user authentication.
 * It validates input fields, queries the database to find the user,
 * verifies the password, and issues a JWT token.
 */
const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    // Check if the user exists in MongoDB
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({
        message: 'Email not registered'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password');
      return res.status(400).json({
        message: 'Incorrect password'
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    };

    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error in loginUserController:', error);
    return res.status(500).json({
      message: 'Server error occurred during login'
    });
  }
};

/**
 * @route GET /api/auth/logout
 * @desc Logs out user and blacklists token
 * @access Public
 */
const logoutUserController = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax'
    });

    if (!token) {
      return res.status(200).json({
        message: 'You have already been logged out'
      });
    }

    await tokenBlacklistModel.create({ token });

    return res.status(200).json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Error in logoutUserController:', error);
    return res.status(500).json({
      message: 'Server error occurred during logout'
    });
  }
};

/**
 * @route GET /api/auth/getme
 * @desc Gets the current logged-in user profile details (excluding password)
 * @access Private
 */
const getMeController = async (req, res) => {
  try {
    // req.user was populated by the authUsers middleware
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json({
      message: 'User profile retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Error in getMeController:', error);
    return res.status(500).json({
      message: 'Server error occurred while retrieving user details'
    });
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController
};

