#!/usr/bin/env node
// @noflow
const request = require('request-promise');
const cp = require('child_process');
const prompt = require('promptly');

async function run() {
  const isRunning = await isCerberusRunning();
  if (!isRunning) {
    console.warn('Cerberus is not running! Network calls may fail. http://t.uber.com/run-cerberus');
  }
  return proxy();
}

function isCerberusRunning() {
  return request('http://localhost:5836/logs')
    .then(logs => logs.includes('now accepting requests')) // post handshaked and configuration
    .catch(() => false);
}

function proxy() {
  process.argv.shift();
  process.argv.shift();
  const cmd = process.argv.shift();
  const args = process.argv;
  const proc = cp.spawn(cmd, args, {
    stdio: 'inherit',
  });
  proc.on('exit', (code) => {
    console.log(`Dev server exited with code ${code}`);
    process.exit(code);
  });
  return proc;
}

run();
