const router = require('express').Router();
const tokenService = require('../../../services/tokenService');
const { google } = require('googleapis');



router.delete('/:id', async (req, res, next) => {
  const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CALLBACK_URL);

  var userJSON = await tokenService.getToken(req.session.user.primary.id);

  userJSON.google.splice(req.params.id, 1);

  console.log("User Data: ", userJSON);
  if (userJSON.google.length >= 1) {
    req.session.user.google = [];
    for (secondaryToken of userJSON.google) {
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
  else {
    req.session.user.google = [];
  }

  console.log("User JSON: ", userJSON);
  console.log("Session: ", req.session.user);
  await tokenService.updateToken(req.session.user.primary.id, userJSON);
  res.send(200);
});


module.exports = router;
