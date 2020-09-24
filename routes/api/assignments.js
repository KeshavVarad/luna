const router = require('express').Router();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

function getCourses(auth, callback) {
    const classroom = google.classroom({ version: 'v1', auth });
    classroom.courses.list({
        pageSize: 10,
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        callback(err, res);
    });
}


router.get('/', (req, res) => {
    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CALLBACK_URL);
    var filename = path.join(__dirname, `../../users/${req.session.user.id}.json`);


    fs.readFile(filename, (err, token) => {
        if (err) console.log(err);
        oAuth2Client.setCredentials(JSON.parse(token));
        const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });
        getCourses(oAuth2Client, async (err, response) => {
            var assignments = {};
            var courses = response.data.courses;
            for (item of courses) {
                var courseWork = await classroom.courses.courseWork.list({courseId: item.id});
                assignments[item.id] = courseWork.data.courseWork;
            };
            res.json(assignments);
        });

    });


});

module.exports = router;


