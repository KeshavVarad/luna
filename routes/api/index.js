const router = require('express').Router();

router.use('/courses', require('./courses'));
router.use('/login', require('./login'));
router.use('/isLoggedIn', require('./isLoggedIn'));
router.use('/assignments', require('./assignments'));

module.exports = router;
