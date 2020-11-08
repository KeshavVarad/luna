const router = require('express').Router();
const { google } = require('googleapis');
const SCOPES = ['profile', 'email'];


router.get("/", function (req, res) {
    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CALLBACK_URL);
    if (!req.session.user) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        res.redirect(authUrl);

    }
    else {
        res.redirect("/assignments")
    }
})

module.exports = router;
