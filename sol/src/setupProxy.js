const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    console.log('test 123');
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3002',
      changeOrigin: true,
    })
  );
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'http://localhost:3002',
      changeOrigin: true,
    })
  );  
};