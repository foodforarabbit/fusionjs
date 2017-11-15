#!/usr/bin/env node
/* eslint-env node */

process.on('unhandledRejection', err => {
  throw err;
});

require('./upload.js')();
