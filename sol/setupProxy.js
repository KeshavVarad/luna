const proxy = require('http-proxy-middleware');

module.exports = app => {
    const options = {
        target: 'http://localhost:3000',
        changeOrigin: true,
    };

    app.use(proxy(['/api'], options));
    app.use(proxy(['/auth'], options))
}

