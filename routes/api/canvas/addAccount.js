const router = require('express').Router();
const fs = require('fs');
const axios = require('axios');
const tokenService = require('../../../services/tokenService');


router.post('/', async (req, res, next) => {
    var userJSON = await tokenService.getToken(req.session.user.primary.id);
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

    

    await tokenService.updateToken(req.session.user.primary.id, userJSON);
    res.redirect('/profile');
});


module.exports = router;
