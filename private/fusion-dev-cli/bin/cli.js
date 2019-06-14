#!/usr/bin/env node
// @noflow
const request = require('request-promise');
const cp = require('child_process');
const prompt = require('promptly');

async function run() {
  const isRunning = await isCerberusRunning();
  if (!isRunning) {
    await ussh();
    if (!await promptForCerberus()) {
      return;
    }
  }
  return proxy();
}

function ussh() {
  return new Promise((resolve, reject) => {
    const child = cp.spawn('ussh', {
      stdio: 'inherit',
    });
    child.on('exit', (code) => {
      if (code === 0) return resolve();
      return reject(new Error('failed to get ussh cert'));
    });
  });
}

async function promptForCerberus() {
  let isRunning = await isCerberusRunning();
  if (!isRunning) {
    console.log('Cerberus is not running. Attempting to start Cerberus');
    runCerberus();
    delay(2000);
  }

  isRunning = await isCerberusRunning();
  let numTries = 0;
  const ms = 1000;
  while (!isRunning && numTries < 30) {
    await delay(ms)
    isRunning = await isCerberusRunning();
    numTries++;
  }
  if (!isRunning) {
    console.log('Could not connect to cerberus. Exiting...')
    return false;
  }
  return true;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function runCerberus() {
  cp.spawn('cerberus', ['--no-status-page'], {
    stdio: ['inherit', 'ignore', 'ignore']
  });
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
  return cp.spawn(cmd, args, {
    stdio: 'inherit',
  });
}

run();
