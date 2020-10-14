const router = require('express').Router();
const axios = require('axios');

router.get("/", async (req, res) => {
    const access_token = "6936~7gX68bO0RTuYi1wZWKfq1dPscE0AaTIYLYI3j3VAqONutQro8v4KpOnP7J99FUtU";
    console.log("Start fetching data...");
    var data;
    axios.get(`https://canvas.instructure.com/api/v1/courses?access_token=${access_token}`)
    .then(response => {
        data = response.data;
        console.log("Data: ", data);
        res.json(data);
    });

    
})


module.exports = router;
