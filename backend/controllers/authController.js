const User = require('../models/User');
const Joi = require('joi');

// Validation schemas
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(50).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Signup
exports.signup = async (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, name } = value;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create new user
    user = new User({
      email,
      password,
      name,
      displayName: `Anon#${Math.floor(Math.random() * 10000)}`,
      authMethod: 'email',
    });

    await user.save();
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      res.status(201).json({
        message: 'Signup successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          displayName: user.displayName,
          avatar: user.avatar,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user has password (not Google OAuth only)
    if (!user.password) {
      return res.status(401).json({ error: 'This account uses Google OAuth. Please login with Google.' });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          displayName: user.displayName,
          avatar: user.avatar,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      displayName: req.user.displayName,
      avatar: req.user.avatar,
    },
  });
};

// Logout
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

// Google OAuth callback
exports.googleCallback = async (profile, done) => {
  try {
    const googleEmail = profile.emails[0].value;

    // 1. Try to find existing user by Google ID (returning user)
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    }

    // 2. Check if a user with the same email already exists (e.g. signed up with email/password before)
    user = await User.findOne({ email: googleEmail });
    if (user) {
      // Link their Google account to the existing profile
      user.googleId = profile.id;
      user.avatar = user.avatar || profile.photos[0]?.value || null;
      user.authMethod = 'google';
      await user.save();
      return done(null, user);
    }

    // 3. Brand-new user — create account
    user = new User({
      googleId: profile.id,
      email: googleEmail,
      name: profile.displayName,
      avatar: profile.photos[0]?.value || null,
      displayName: `Anon#${Math.floor(Math.random() * 10000)}`,
      authMethod: 'google',
    });

    await user.save();
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
};

