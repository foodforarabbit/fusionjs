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
    .option('--skip-install', 'Avoid running `yarn install`')
    .option('--hoist-deps', [
      'Generates a package.json without dependencies fields',
      'Use this flag if scaffolding into a versionless monorepo with a global yarn.lock file',
    ])
    .action(args => {
      const {
        l: localPathShorthand,
        'local-path': localPath,
        'skip-install': skipInstall = false,
        'hoist-deps': hoistDeps = false,
      } = args;
      scaffold({
        localPath: localPath || localPathShorthand,
        skipInstall,
        hoistDeps,
      });
    });

  cli
    .command('provision')
    .describe('Publish a web application')
    .action(provision);

  cli.parse(process.argv);
}
run();
