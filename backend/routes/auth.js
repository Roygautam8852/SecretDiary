const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Email/Password Authentication
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Get current user
router.get('/me', authController.getCurrentUser);

// Logout
router.post('/logout', authController.logout);

// Google OAuth routes (for future integration)
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL,
    session: true,
  }),
  (req, res) => {
    res.redirect(
      `${process.env.FRONTEND_URL}/?authenticated=true`
    );
  }
);

module.exports = router;
