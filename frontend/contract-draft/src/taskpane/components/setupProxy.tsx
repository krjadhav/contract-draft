const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy configuration for http://localhost:8000
  app.use(
    '/api/draft',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );

  // Proxy configuration for https://movieapp-1-a9282068.deta.app
  app.use(
    '/api/draft',
    createProxyMiddleware({
      target: 'https://contractdraft-1-c2320655.deta.app/',
      changeOrigin: true,
    })
  );

  // Additional proxy configurations...
};
