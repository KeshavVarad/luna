const router = require('express').Router();

router.use('/login', require('./logins/login'));
router.use('/', require('./isLoggedIn'));
router.use('/google/courses', require('./google/courses'));
router.use('/google/assignments', require('./google/assignments'));

router.use('/canvasLogin', require('./logins/canvasLogin'));
router.use('/canvasCourses', require('./canvas/courses'));
router.use('/canvas/assignments', require('./canvas/assignments'));

module.exports = router;
