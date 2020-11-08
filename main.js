const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const url = require('url');
const session = require('express-session');
var FileStore = require('session-file-store')(session);
const app = express();
const { google } = require('googleapis');
const axios = require('axios');
const tokenService = require('./services/tokenService');
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



app.use(require('./routes'));

app.use(express.static(path.join(__dirname, './sol/build')));



// Example protected and unprotected routes
// app.get('/', (req, res) => res.redirect("http://localhost:3000"));

//app.get('/login', (req, res) => res.send('Please log in'));

app.get('/auth/google/callback', async (req, res) => {

  //Make the oAuth client
  const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CALLBACK_URL);

  //Get the code to get the token from the url
  const queryObject = url.parse(req.url, true);
  const code = queryObject.query.code;



  //Get the token using the code
  var tokenRes = await oAuth2Client.getToken(code);
  var token = tokenRes.tokens;


  //Set the oAuthClient to use the token that we just got
  oAuth2Client.setCredentials(token);

  //Make an oauth2 client using the oAuthClient we just made
  var oauth2 = google.oauth2({
    auth: oAuth2Client,
    version: 'v2'
  });

  //Get the user's info
  var user = await oauth2.userinfo.get();
  //Make a variable called userData
  var userToken;

  //If the user's data is not stored in the session
  if (!req.session.user) {

    req.session.user = {};
    //Store the user's data into the session
    req.session.user.primary = user.data;
    req.session.user.google = [];
    req.session.user.canvas = [];

    //Read file that has user data in it
    userToken = await tokenService.getToken(req.session.user.primary.id);
    if (!userToken) {
      userToken = { primary: {}, google: [], canvas: [] };
      userToken.primary = token;
      userToken._id = req.session.user.primary.id;
      await tokenService.insertToken(userToken);
    }

    if (userToken.google.length >= 1) {
      for (secondaryToken of userToken.google) {
        //Set the oAuthClient to use the token that we just got
        oAuth2Client.setCredentials(secondaryToken);

        //Make an oauth2 client using the oAuthClient we just made
        oauth2 = google.oauth2({
          auth: oAuth2Client,
          version: 'v2'
        });

        var secondaryUser = await oauth2.userinfo.get();
        req.session.user.google.push(secondaryUser.data);
      }
    }
    if (userToken.canvas.length >= 1) {
      for (canvasToken of userToken.canvas) {
        const account = await axios.get(`https://rchs.instructure.com/api/v1/users/self`, {
          params: {
            access_token: canvasToken,
          }
        });
        req.session.user.canvas.push(account.data);
      }
    }
    res.redirect("/assignments");
  

  }
  else {
    req.session.user.google.push(user.data);
    userToken = await tokenService.getToken(req.session.user.primary.id);
    userToken.google.push(token);
    await tokenService.updateToken(req.session.user.primary.id, userToken);
    res.redirect('/profile');

  }







});

app.get('/api/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log("--> session destroy failed.err -> ", err);
    }
  });
  res.redirect('/');
});

app.get('*', (req, res) => {
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
