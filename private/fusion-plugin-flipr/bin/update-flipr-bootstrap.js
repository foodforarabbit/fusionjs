#!/usr/bin/env node

// Need to execute from JS because Yarn v2 expects package "bin" entries to be JS

const path = require('path');
const child_process = require('child_process');

const {status} = child_process.spawnSync(
  path.join(__dirname, 'update-flipr-bootstrap.sh'),
  process.argv.slice(2),
  {stdio: 'inherit'}
);

process.exitCode = status === null ? 1 : status;
