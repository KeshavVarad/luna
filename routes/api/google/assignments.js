const router = require('express').Router();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const date_and_time = require('date-and-time');

async function getCourses(auth, user, callback) {
    var allTokens = [user.primary, ...user.secondary];
    var allCourses = [];

    for (var token of allTokens) {
        auth.setCredentials(token);
        const classroom = google.classroom({ version: 'v1', auth });

        let courseList = await classroom.courses.list({
            pageSize: 10,
            courseStates: ["ACTIVE"],
        });




        allCourses = [...allCourses, ...courseList.data.courses];



    }


    callback(allCourses);
}

async function getAssignments(auth, user) {
    //Get today's date
    var date_obj = new Date();
    var date = date_obj.getDate();
    var day = date_obj.getDay();
    var month = date_obj.getMonth();
    var year = date_obj.getFullYear();

    var sundayDate;
    var sundayMonth;
    var sundayYear;

    //Find sunday's date

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



    var allTokens = [user.primary, ...user.secondary];
    var allAssignments = [];

    for (var token of allTokens) {
        console.log("Token: ", token);
        auth.setCredentials(token);
        const classroom = google.classroom({ version: 'v1', auth });

        let courseList = await classroom.courses.list({
            pageSize: 10,
            courseStates: ["ACTIVE"],
        });

        for (item of courseList.data.courses) {
            console.log("Calling coursework from ", item.name);
            var courseWork = await classroom.courses.courseWork.list({ courseId: item.id, orderBy: "dueDate desc", pageSize: 10 });
            //Get the nextPageToken to get more courses
            var nextPageToken = courseWork.data.nextPageToken;
            //Get the index for the last coursework in the array
            var index = courseWork.data.courseWork.length - 1;

            //Get more coursework if there is still more in the week
            while ((index < courseWork.data.courseWork.length) && nextPageToken && courseWork.data.courseWork[index].dueDate && (courseWork.data.courseWork[index].dueDate.year >= sundayYear) && (courseWork.data.courseWork[index].dueDate.month >= sundayMonth) && (courseWork.data.courseWork[index].dueDate.day >= sundayDate)) {
                var newCourseWork = await classroom.courses.courseWork.list({ courseId: item.id, orderBy: "dueDate desc", pageSize: 10, pageToken: nextPageToken });
                nextPageToken = newCourseWork.data.nextPageToken;
                courseWork.data.courseWork.push(newCourseWork.data.courseWork);

                index++;
            }




            allAssignments = [...allAssignments, ...courseWork.data.courseWork];



        }


        
    }
    return allAssignments;
}


router.get('/', (req, res) => {
    //Make oauth client
    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CALLBACK_URL);
    //File name for user's data
    var filename = path.join(__dirname, `../../../users/${req.session.user.id}.json`);

    //Get today's date
    var date_obj = new Date();
    var date = date_obj.getDate();
    var day = date_obj.getDay();
    var month = date_obj.getMonth();
    var year = date_obj.getFullYear();

    var sundayDate;
    var sundayMonth;
    var sundayYear;

    //Find sunday's date

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


    //Make assignments object
    var assignments = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
    };



    //Read file that has user data in it
    fs.readFile(filename, async (err, data) => {
        if (err) console.log(err);

        var user = JSON.parse(data);


        var allAssignments = await getAssignments(oAuth2Client, user);
        // Add the coursework to the right day in the assignments object
        for (assignment of allAssignments) {








            if (assignment.dueDate) {
                var minute, hour, day, month, year;
                month = `${(assignment.dueDate.month >= 10) ? assignment.dueDate.month : `0${assignment.dueDate.month}`}`;
                day = `${(assignment.dueDate.day >= 10) ? assignment.dueDate.day : `0${assignment.dueDate.day}`}`;
                if (assignment.dueTime.hours) {
                    hour = `${(assignment.dueTime.hours >= 10) ? assignment.dueTime.hours : `0${assignment.dueTime.hours}`}`;
                }
                else {
                    hour = "00";
                }
                if (assignment.dueTime.minutes) {
                    minute = `${(assignment.dueTime.minutes >= 10) ? assignment.dueTime.minutes : `0${assignment.dueTime.minutes}`}`;
                }
                else {
                    minute = "00";
                }
                var dateString = `${assignment.dueDate.year}-${month}-${day}T${hour}:${minute}Z`;
                const patternTime = date_and_time.compile('D');
                var assignmentDueDay = date_and_time.format(new Date(dateString), patternTime);



                if (assignmentDueDay == sundayDate) {
                    assignments["sunday"].push(assignment);
                }
                else if (assignmentDueDay == (sundayDate + 1)) {
                    assignments["monday"].push(assignment);
                }
                else if (assignmentDueDay == (sundayDate + 2)) {
                    assignments["tuesday"].push(assignment);
                }
                else if (assignmentDueDay == (sundayDate + 3)) {
                    assignments["wednesday"].push(assignment);
                }
                else if (assignmentDueDay == (sundayDate + 4)) {
                    assignments["thursday"].push(assignment);
                }
                else if (assignmentDueDay == (sundayDate + 5)) {
                    assignments["friday"].push(assignment);
                }
                else if (assignmentDueDay == (sundayDate + 6)) {
                    assignments["saturday"].push(assignment);
                }
            }
        }


        res.json(assignments);
    });







});



module.exports = router;


