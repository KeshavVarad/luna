const router = require('express').Router();


router.use('/courses', require('./courses'));
router.use('/assignments', require('./assignments'));
router.use('/addAccount', require('./addAccount'));
router.use('/deleteAccount', require('./deleteAccount'));

module.exports = router;
