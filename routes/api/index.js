const router = require('express').Router();

router.use('/login', require('./login'));
router.use('/', require('./isLoggedIn'));
router.use('/courses', require('./courses'));
router.use('/assignments', require('./assignments'));

module.exports = router;
