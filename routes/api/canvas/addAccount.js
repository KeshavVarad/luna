const router = require('express').Router();
const fs = require('fs');
const path = require('path');


router.post('/', (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, `../../../users/${req.session.user.primary.id}.json`));
    var userJSON = JSON.parse(data);

    if (!userJSON.canvas) {
        userJSON.canvas = [];
        userJSON.canvas.push(req.body.accessToken);
    } else {
        userJSON.canvas.push(req.body.accessToken);
    }

    fs.writeFile(`./users/${req.session.user.primary.id}.json`, JSON.stringify(userJSON), (err) => {
        if (err) return console.error(err);
        res.redirect('/profile');
    });
});


module.exports = router;
