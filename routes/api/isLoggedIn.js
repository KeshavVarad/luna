const router = require('express').Router();
var isLoggedIn;

router.use('/', function(req, res, next) {

    if(!req.session.user){
        res.redirect("/");
    }
    next();
});

module.exports = router;


