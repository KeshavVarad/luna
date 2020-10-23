const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');


router.post('/', async (req, res, next) => {
    const data = fs.readFileSync(path.join(__dirname, `../../../users/${req.session.user.primary.id}.json`));
    var userJSON = JSON.parse(data);
    const access_token = req.body.accessToken;

    try {

        const account = await axios.get(`https://rchs.instructure.com/api/v1/users/self`, {
          params: {
            access_token: access_token,
          }
        });
        req.session.user.canvas.push(account.data);


        if (!userJSON.canvas) {
            userJSON.canvas = [];
            userJSON.canvas.push(req.body.accessToken);
        } else {
            userJSON.canvas.push(req.body.accessToken);
        }
    }
    catch (e) {
        userJSON.canvas = [];
    }

    

    fs.writeFile(`./users/${req.session.user.primary.id}.json`, JSON.stringify(userJSON), (err) => {
        if (err) return console.error(err);
        res.redirect("/profile");
    });
});


module.exports = router;
