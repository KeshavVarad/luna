const router = require('express').Router();
const { google } = require('googleapis');
const SCOPES = ['profile', 'email', 'https://www.googleapis.com/auth/classroom.courses.readonly', 'https://www.googleapis.com/auth/classroom.coursework.me.readonly'];
const path = require('path');
const fs = require('fs');

router.get("/", function (req, res) {
    console.log('Start login');
    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CALLBACK_URL);
    if (!req.session.user) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        res.redirect(authUrl);

    }
    else {
        console.log("Calling Redirect");
        res.redirect("/courses")
    }
})

module.exports = router;
