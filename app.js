const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('cookie-session');
const app = express();
require('custom-env').env();

require("./lib/passport-setup");

app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'luna-session',
  keys: ['key1', 'key2']
}))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}


app.use(passport.initialize());
app.use(passport.session());





// Example protected and unprotected routes
app.get('/', (req, res) => res.redirect("/login"))

app.get('/api/login', (req, res) => res.send('Please log in'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/api/profile', isLoggedIn, (req, res) => res.send(`Welcome back ${req.user.displayName}!`))

// Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], accessType: 'offline'}));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/api/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/api/profile');
  }
);

app.get('/api/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/api/login');
})



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
