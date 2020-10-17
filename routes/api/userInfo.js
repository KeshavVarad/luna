const router = require('express').Router();


router.get("/", (req, res) => {
    console.log(req.session.user.canvas);
    res.json(req.session.user);
});


module.exports = router;

