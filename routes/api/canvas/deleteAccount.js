const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { nextTick } = require('process');


router.delete('/:id', async (req, res, next) => {
    const data = fs.readFileSync(path.join(__dirname, `../../../users/${req.session.user.primary.id}.json`));
    var userJSON = JSON.parse(data);

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

    fs.writeFile(`./users/${req.session.user.primary.id}.json`, JSON.stringify(userJSON), (err) => {
        if (err) return console.error(err);
        res.sendStatus(200);
    });
});


module.exports = router;
