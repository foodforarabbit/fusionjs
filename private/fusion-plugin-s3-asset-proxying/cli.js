#!/usr/bin/env node
// @noflow
/* eslint-env node */

process.on('unhandledRejection', err => {
  throw err;
});

require('./upload.js')();
