const router = require('express').Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

router.get("/", async (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, `../../../users/${req.session.user.primary.id}.json`));
    const userJSON = JSON.parse(data);
    const access_token = userJSON.canvas[0];
    var courses;
    axios.get(`https://rchs.instructure.com/api/v1/courses?access_token=${access_token}`)
    .then(response => {
        courses = response.data;
        res.json(courses);
    });

    
})


module.exports = router;
