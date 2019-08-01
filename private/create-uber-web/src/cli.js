#!/usr/bin/env node

/* @flow */

import proc from 'child_process';
import {promptChoice} from './utils/prompt-choice.js';

process.on('unhandledRejection', e => {
  throw e;
});

const latest = proc
  .execSync('npm info @uber/create-uber-web version 2>/dev/null')
  .toString()
  .trim();
const version = require('../package.json').version;

(async function() {
  let keepCanary = false;
  if (version.includes('canary')) {
    keepCanary = await promptChoice(
      `Canary version ${version} is installed, keep this version?`,
      {
        'Yes - use current canary version': true,
        'No - install latest version': false,
      }
    );
  }

  if (latest !== version && !keepCanary) {
    // eslint-disable-next-line no-console
    console.log(`Upgrading uber-web from ${version} to ${latest}`);
    // do a clean install because upgrades can break with stupid errors e.g. EISGIT.
    proc.execSync(`
    yarn global remove @uber/create-uber-web || true;
    npm uninstall @uber/create-uber-web --global || true;
    npm install @uber/create-uber-web --global || true;
  `);
    // eslint-disable-next-line no-console
    console.log('Upgrade complete. Please rerun this command.');
    process.exit();
  }

  require('./index.js');
})();
