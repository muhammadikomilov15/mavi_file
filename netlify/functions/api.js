const serverless = require('serverless-http');
const express = require('express');
const app = require('../../server/src/server');

// Wrapper to ensure compatibility with Netlify redirects
const netlifyApp = express();

netlifyApp.use((req, res, next) => {
  // Normalize URL so backend routes (e.g. /api/products) match correctly
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url === '/' ? '' : req.url);
  }
  next();
});

netlifyApp.use(app);

module.exports.handler = serverless(netlifyApp);
