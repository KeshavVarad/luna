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
    var date_obj = new Date();
    var date = date_obj.getDate();
    var day = date_obj.getDay();
    var month = date_obj.getMonth();
    var year = date_obj.getFullYear();

    var sundayDate;
    var sundayMonth;
    var sundayYear;

    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 0) {
        if ((date - day) > 0) {
            sundayDate = date - day;
            sundayMonth = month;
            sundayYear = year;
        }
        else {
            sundayDate = date - day + 31;
            sundayMonth = month - 1;
            if (month == 0) {
                sundayYear = year - 1;
            }
            else {
                sundayYear = year;
            }
        }

    }
    else if (month == 3 || month == 5 || month == 8 || month == 10) {
        if ((date - day) > 0) {
            sundayDate = date - day;
            sundayMonth = month;
            sundayYear = year;
        }
        else {
            sundayDate = date - day + 30;
            sundayMonth = month - 1;
            sundayYear = year;
        }
    }
    else if (month == 1 && ((year % 4) == 0) && ((year % 100) == 0) && ((year % 400) == 0)) {
        if ((date - day) > 0) {
            sundayDate = date - day;
            sundayMonth = month;
            sundayYear = year;
        }
        else {
            sundayDate = date - day + 29;
            sundayMonth = month - 1;
            sundayYear = year;
        }
    }
    else {
        if ((date - day) > 0) {
            sundayDate = date - day;
            sundayMonth = month;
            sundayYear = year;
        }
        else {
            sundayDate = date - day + 31;
            sundayMonth = month - 1;
            sundayYear = year;
        }
    }

    var sundayMonth

    fs.readFile(filename, (err, user) => {
        if (err) console.log(err);
        oAuth2Client.setCredentials(JSON.parse(user).primary);
        const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });
        getCourses(oAuth2Client, async (err, response) => {
            var assignments = {
                sunday: [],
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: []
            };
            var courses = response.data.courses;
            for (item of courses) {
                var courseWork = await classroom.courses.courseWork.list({ courseId: item.id, orderBy: "dueDate desc", pageSize: 10 });
                var nextPageToken = courseWork.data.nextPageToken;
                var index = courseWork.data.courseWork.length - 1;
                while ((index < courseWork.data.courseWork.length) && nextPageToken && courseWork.data.courseWork[index].dueDate && (courseWork.data.courseWork[index].dueDate.year >= sundayYear) && (courseWork.data.courseWork[index].dueDate.month >= sundayMonth) && (courseWork.data.courseWork[index].dueDate.day >= sundayDate)) {
                    var newCourseWork = await classroom.courses.courseWork.list({ courseId: item.id, orderBy: "dueDate desc", pageSize: 10, pageToken: nextPageToken });
                    nextPageToken = newCourseWork.data.nextPageToken;
                    courseWork.data.courseWork.push(newCourseWork.data.courseWork);
                    index++;
                }
                for (assignment of courseWork.data.courseWork) {
                    if (assignment.dueDate) {
                        if (assignment.dueDate.day == sundayDate) {
                            assignments["sunday"].push(assignment);
                        }
                        else if (assignment.dueDate.day == (sundayDate + 1)) {
                            assignments["monday"].push(assignment);
                        }
                        else if (assignment.dueDate.day == (sundayDate + 2)) {
                            assignments["tuesday"].push(assignment);
                        }
                        else if (assignment.dueDate.day == (sundayDate + 3)) {
                            assignments["wednesday"].push(assignment);
                        }
                        else if (assignment.dueDate.day == (sundayDate + 4)) {
                            assignments["thursday"].push(assignment);
                        }
                        else if (assignment.dueDate.day == (sundayDate + 5)) {
                            assignments["friday"].push(assignment);
                        }
                        else if (assignment.dueDate.day == (sundayDate + 6)) {
                            assignments["saturday"].push(assignment);
                        }
                    }
                }
            };

            


            res.json(assignments);
        });

    });


});

module.exports = router;


