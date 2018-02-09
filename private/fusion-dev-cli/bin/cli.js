#!/usr/bin/env node
const request = require('request-promise');
const cp = require('child_process');
const prompt = require('promptly');

async function run() {
  const isRunning = await isCerberusRunning();
  if (!isRunning) {
    if (!await promptForCerberus()) {
      return;
    }    
  }
  return proxy();
}

async function promptForCerberus() {
  let choices = [1, 2, 3];
  const message =
    'Cerberus is not running. Would you like to start cerberus in the background? [Y/n]';
  const result = await prompt.confirm(message, {default: 'Y'});
  if (result) {
    console.log('Starting up cerberus...');
    runCerberus();
    delay(2000);
  } 
  let isRunning = await isCerberusRunning()
  let numTries = 0;
  const ms = 1000;
  while (!isRunning && numTries < 5) {
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
  cp.spawn('cerberus', {
    stdio: ['inherit', 'ignore', 'ignore']
  });
  
}

function isCerberusRunning() {
  return request('http://localhost:5836/').then(() => true).catch(() => false);
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