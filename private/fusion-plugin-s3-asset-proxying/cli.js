#!/usr/bin/env node
// @flow
/* eslint-env node */

process.on('unhandledRejection', err => {
  throw err;
});

require('./upload.js')();
