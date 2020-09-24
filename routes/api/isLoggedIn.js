const router = require('express').Router();
var isLoggedIn;

router.get('/', function(req, res) {

    if(req.session.users){
        isLoggedIn = true;
    }
    else {
        isLoggedIn = false;
    }
    res.send(isLoggedIn);
});

module.exports = router;


