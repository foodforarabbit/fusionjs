// @flow

const cp = require('child_process');
const {request} = require('https');

module.exports.startCerberus = async () => {
  let isRunning = await isCerberusRunning();
  if (!isRunning) {
    await ussh();
    runCerberus();

    let numTries = 0;
    do {
      await delay(1000);
      isRunning = await isCerberusRunning();
      numTries++;
    } while (!isRunning && numTries < 10);
    if (!isRunning) {
      // eslint-disable-next-line no-console
      console.log('Could not connect to cerberus. Exiting...');
    }
  }
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ussh() {
  return new Promise((resolve, reject) => {
    const child = cp.spawn('ussh', {stdio: 'inherit'});
    child.on('exit', code => {
      if (code === 0) return resolve();
      return reject(new Error('failed to get ussh cert'));
    });
  });
}

function runCerberus() {
  cp.spawn('cerberus', ['--no-status-page'], {
    stdio: ['inherit', 'ignore', 'ignore'],
  });
}

function isCerberusRunning() {
  return new Promise(resolve => {
    const req = request({path: '/', port: 5836}, res => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}
