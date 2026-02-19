const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleEmail = profile.emails[0].value;

        // 1. Returning Google user — find by googleId
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // 2. Email already exists (e.g. signed up with email/password before)
        //    → link Google account to that existing user
        user = await User.findOne({ email: googleEmail });
        if (user) {
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
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
