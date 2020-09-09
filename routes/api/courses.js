const router = require('express').Router();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const SCOPES = ['profile', 'email', 'https://www.googleapis.com/auth/classroom.courses.readonly'];


function listCourses(auth, callback) {
    const classroom = google.classroom({ version: 'v1', auth });
    classroom.courses.list({
        pageSize: 10,
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const courses = res.data.courses;
        callback(err, res);
        // if (courses && courses.length) {
        //     console.log('Courses:');
        //     courses.forEach((course) => {
        //         console.log(`${course.name} (${course.id})`);
        //     });
        // } else {
        //     console.log('No courses found.');
        // }
    });
}


router.get('/', (req, res) => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CALLBACK_URL);
    if (!req.session.user) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        res.redirect(authUrl);
    } else {
        var filename = path.join(__dirname, `../../users/${req.session.user.id}.json`);
        fs.readFile(filename, (err, token) => {
            if(err) console.log(err);
            console.log("Token ", token);
            oAuth2Client.setCredentials(JSON.parse(token));
            listCourses(oAuth2Client, (err, response) => {
                res.json({data: response.data.courses});
            });
        });

    }
});

module.exports = router;


