const router = require('express').Router();

router.get("/", (req, res) => {
    var authURL = generateAuthURL('xxx', 'xxx');
    console.log(authURL);
})

function generateAuthURL(client_id, redirect_uri) {
    return `https://<canvas-install-url>/login/oauth2/auth?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=url:GET|/api/v1/courses/:course_id/assignments`
}

module.exports = router;

