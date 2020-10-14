const router = require('express').Router();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');


function getCourses(auth, callback) {
    const classroom = google.classroom({ version: 'v1', auth });
    classroom.courses.list({
        pageSize: 10,
        courseStates: ["ACTIVE"],
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        callback(err, res);
    });
}


router.get('/', (req, res) => {
    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CALLBACK_URL);
    var filename = path.join(__dirname, `../../../users/${req.session.user.id}.json`);
    fs.readFile(filename, (err, user) => {
        if (err) console.log(err);
        console.log(user);
        oAuth2Client.setCredentials(JSON.parse(user).primary);
        getCourses(oAuth2Client, (err, response) => {
            res.json({ data: response.data.courses });
        });
    });


});

module.exports = router;


