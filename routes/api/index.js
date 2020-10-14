const router = require('express').Router();

router.use('/login', require('./logins/login'));
router.use('/', require('./isLoggedIn'));

router.use('/addAccount', require('./logins/addAccount'));
router.use('/userInfo', require('./userInfo'));


router.use('/google', require('./google'));

router.use('/canvas', require('./canvas'));

module.exports = router;
