const router = require('express').Router();


router.get("/", (req, res) => {
    console.log("User Info: ", req.session.user);
    res.json(req.session.user);
});


module.exports = router;

