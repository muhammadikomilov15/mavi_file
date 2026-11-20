// Vercel Serverless Function entry point
require('dotenv').config();
const app = require('../server/src/server');

module.exports = app;
