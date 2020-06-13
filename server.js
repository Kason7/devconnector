const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

// Passport resources (from Emaily course)
const cookieSession = require('cookie-session'); // Used to encrypt the oauth cookies
const passport = require('passport');
const keys = require('./config/keys');
require('./services/passport');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Middleware for passport oAuth (from Emaily course)
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // Has to be given in miliseconds, which is equal to 30 days
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Setting our routes for passport oAuth (from Emaily course)
require('./routes/authRoutes')(app);

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
