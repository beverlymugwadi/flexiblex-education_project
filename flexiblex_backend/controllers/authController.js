const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const authController = {
  signup: async (req, res) => {
    try {
      const { email, password, userType } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists'
        });
      }

      const user = new User({ email, password, userType });
      await user.save();

      const token = jwt.sign(
        { id: user._id, email, userType },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send welcome email
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: 'Welcome to FlexibleX Education',
          text: 'Your account has been created successfully.'
        });
      } catch (emailError) {
        console.error('Welcome email error:', emailError);
      }

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          userType: user.userType
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password'
        });
      }

      const token = jwt.sign(
        { id: user._id, email, userType: user.userType },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          userType: user.userType
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error logging in',
        error: error.message
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const resetToken = jwt.sign(
        { id: user._id, email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: 'Password Reset Request',
          text: `Click the following link to reset your password: ${process.env.RESET_URL}/${resetToken}`
        });

        res.json({
          success: true,
          message: 'Password reset email sent'
        });
      } catch (emailError) {
        res.status(500).json({
          success: false,
          message: 'Error sending reset email',
          error: emailError.message
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error processing reset request',
        error: error.message
      });
    }
  }
};

module.exports = authController;