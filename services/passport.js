const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// const User = mongoose.model('users');
const User = require('../models/User');

// Preparing for authentication with cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// Preparing for authentication with cookie
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// Use passport library to use Google oAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      // Console log show Google respond with the profile object that contains id
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          // We already have a record with the given profile ID
          // To end the function from passport we call done (4th function argument)
          done(null, existingUser); // existingUser is now the identified user
        } else {
          // We don't have a user record with this ID, create and save one!
          new User({ googleId: profile.id })
            .save()
            // We make another promise callback with .then() to make sure its saved properly before calling done
            .then((user) => done(null, user));
        }
      });
    }
  )
);
