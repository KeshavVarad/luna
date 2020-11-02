const router = require('express').Router();
const fs = require('fs');
const { token } = require('morgan');
const tokenService = require('../../../services/tokenService');


router.delete('/:id', async (req, res) => {

    var userJSON = await tokenService.getToken(req.session.user.primary.id);

    userJSON.canvas.splice(req.params.id, 1);

    if (userJSON.canvas.length >= 1) {
        for (canvasToken of userJSON.canvas) {
            const account = await axios.get(`https://rchs.instructure.com/api/v1/users/self`, {
                params: {
                    access_token: canvasToken,
                }
            });
            req.session.user.canvas.push(account.data);
        }
    }
    else {
        req.session.user.canvas = [];
    }

    await tokenService.updateToken(req.session.user.primary.id, userJSON);
    console.log("Sucess;");
    res.sendStatus(200);
});


module.exports = router;
