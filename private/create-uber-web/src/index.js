#!/usr/bin/env node

/* @flow */

import sade from 'sade';
import {exec} from '@dubstep/core';
import scaffold from './commands/scaffold.js';
import provision from './commands/provision.js';

process.on('unhandledRejection', e => console.log(e.stack));

async function run() {
  const cli = sade('yarn create @uber/uber-web');

  cli
    .command('scaffold')
    .describe('Scaffold a new project structure locally')
    .option('--local-path, -l', 'Use a local folder as the template')
    .option('--skip-install', 'Use a local folder as the template')
    .action(({'local-path': path, l, 'skip-install': skipInstall}) => {
      scaffold({
        localPath: path || l,
        skipInstall: skipInstall || false,
      });
    });

  cli
    .command('provision')
    .describe('Publish a web application')
    .action(provision);

  cli.parse(process.argv);
}
run();
