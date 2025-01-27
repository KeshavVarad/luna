const router = require('express').Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const date_and_time = require('date-and-time');
const tokenService = require('../../../services/tokenService');

router.get("/", async (req, res) => {
    var allAssignments = [];

    var userToken = await tokenService.getToken(req.session.user.primary.id);
    if (userToken.canvas.length >= 1) {
        allAssignments = await getAssignments(userToken.canvas);
    }
    //Get today's date
    var now = new Date();
    var day = now.getDay();
    var sundayDate = date_and_time.addDays(now, -day);
    var mondayDate = date_and_time.addDays(sundayDate, 1);
    var tuesdayDate = date_and_time.addDays(sundayDate, 2);
    var wednesdayDate = date_and_time.addDays(sundayDate, 3);
    var thursdayDate = date_and_time.addDays(sundayDate, 4);
    var fridayDate = date_and_time.addDays(sundayDate, 5);
    var saturdayDate = date_and_time.addDays(sundayDate, 6);

    var assignments = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
    };

    if (allAssignments) {
        for (assignment of allAssignments) {

            if (assignment.due_at) {

                const dateString = assignment.due_at;
                var assignmentDueDate = new Date(dateString);


                if (date_and_time.isSameDay(assignmentDueDate, sundayDate)) {
                    assignments["sunday"].push(assignment);
                }
                else if (date_and_time.isSameDay(assignmentDueDate, mondayDate)) {
                    assignments["monday"].push(assignment);
                }
                else if (date_and_time.isSameDay(assignmentDueDate, tuesdayDate)) {
                    assignments["tuesday"].push(assignment);
                }
                else if (date_and_time.isSameDay(assignmentDueDate, wednesdayDate)) {
                    assignments["wednesday"].push(assignment);
                }
                else if (date_and_time.isSameDay(assignmentDueDate, thursdayDate)) {
                    assignments["thursday"].push(assignment);
                }
                else if (date_and_time.isSameDay(assignmentDueDate, fridayDate)) {
                    assignments["friday"].push(assignment);
                }
                else if (date_and_time.isSameDay(assignmentDueDate, saturdayDate)) {
                    assignments["saturday"].push(assignment);
                }
            }
        }
    }

    res.json(assignments);


});

async function getAssignments(access_tokens) {
    var allAssignments = [];
    for (access_token of access_tokens) {

        var coursesResponse = await axios.get(`https://rchs.instructure.com/api/v1/courses`, {
            params: {
                access_token,
            }
        });
        var courses = coursesResponse.data;


        var assignments = [];
        if (courses) {
            for (course of courses) {
                var newAssignments;
                try {
                    var assignmentResponse = await axios.get(`https://rchs.instructure.com/api/v1/courses/${course.id}/assignments`, {
                        params: {
                            access_token,
                            include: ["all_dates"],
                            order_by: "due_at",
                            bucket: "future",

                        }
                    });
                    newAssignments = assignmentResponse.data;
                }
                catch {
                    newAssignments = [];
                }
                assignments = [...assignments, ...newAssignments];
            }
        }



        allAssignments = [...allAssignments, ...assignments];
    }

    return allAssignments;
}


module.exports = router;
