const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const url = require('url');
const fs = require('fs');
const session = require('express-session');
var FileStore = require('session-file-store')(session);
const app = express();
const { google } = require('googleapis');
require('custom-env').env();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret-key',
  resave: false,
  store: new FileStore,
  saveUninitialized: false,
}));

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  };
};

app.use(require('./routes'));

app.use(express.static(path.join(__dirname, './sol/build')));



// Example protected and unprotected routes
// app.get('/', (req, res) => res.redirect("http://localhost:3000"));

//app.get('/login', (req, res) => res.send('Please log in'));

app.get('/auth/google/callback', (req, res) => {
  const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CALLBACK_URL);
  const queryObject = url.parse(req.url, true);
  const code = queryObject.query.code;

  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    oAuth2Client.setCredentials({ access_token: token.access_token });
    var oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: 'v2'
    });

    oauth2.userinfo.get(
      (err, user) => {
        if (err) {
          console.log(err);
        } else {
          req.session.user = user.data;
          // Store the token to disk for later program executions
          fs.writeFile(`./users/${req.session.user.id}.json`, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            res.redirect('/courses');
          });

        }
      }
    );




  })


});

app.get('/api/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log("--> session destroy failed.err -> ", err);
    }
  });
  res.redirect('http://localhost:3000');
});

app.get('*', (req, res) => {
  console.log("Static files sending...");
  console.log(path.join(__dirname, '/sol/build', 'index.html'));
  res.sendFile(path.join(__dirname, '/sol/build', 'index.html'));
});



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
});

module.exports = app;
