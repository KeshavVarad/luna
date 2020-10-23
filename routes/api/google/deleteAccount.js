const router = require('express').Router();
const fs = require('fs');
const path = require('path');


router.delete('/:id', async (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, `../../../users/${req.session.user.primary.id}.json`));
    var userJSON = JSON.parse(data);

    userJSON.secondary.splice(req.params.id, 1);

    if (userJSON.secondary.length >= 1) {
        for (secondaryToken of userJSON.secondary) {
          //Set the oAuthClient to use the token that we just got
          oAuth2Client.setCredentials(secondaryToken);
  
          //Make an oauth2 client using the oAuthClient we just made
          oauth2 = google.oauth2({
            auth: oAuth2Client,
            version: 'v2'
          });
  
          var secondaryUser = await oauth2.userinfo.get();
          req.session.user.secondary.push(secondaryUser.data);
        }
      }
    else {
        req.session.user.secondary = [];
    }

    fs.writeFile(`./users/${req.session.user.primary.id}.json`, JSON.stringify(userJSON), (err) => {
        if (err) return console.error(err);
        res.sendStatus(200);
    });
});


module.exports = router;
