#!/usr/bin/env node

/* @flow */

import sade from 'sade';
import {exec} from '@dubstep/core';
import {scaffold} from './commands/scaffold.js';
import {upgrade} from './commands/upgrade.js';
import {provision} from './commands/provision.js';

process.on('unhandledRejection', e => console.log(e.stack));

const cli = sade('create-uber-web');

cli.version(require('../package.json').version);

cli
  .command('scaffold')
  .describe('Scaffold a new project structure locally')
  .option('--type', 'website, fusion-plugin, react-component or library', '')
  .option('--name', 'Project name', '')
  .option('--description', 'Project description', '')
  .option('--team', 'Team name', '')
  .option('--audience', 'external or internal')
  .option('--local-path, -l', 'Use a local folder as the template')
  .option('--skip-install', 'Avoid running `yarn install`')
  .option('--hoist-deps', [
    'Generates a package.json without dependencies fields',
    'Use this flag if scaffolding into a versionless monorepo with a global yarn.lock file',
  ])
  .action(args => {
    const {
      type,
      name,
      description,
      team,
      audience,
      l: localPathShorthand,
      'local-path': localPath,
      'skip-install': skipInstall = false,
      'hoist-deps': hoistDeps = false,
    } = args;
    scaffold({
      type,
      name,
      description,
      team,
      external: {external: true, internal: false}[audience],
      localPath: localPath || localPathShorthand,
      skipInstall,
      hoistDeps,
    });
  });

cli
  .command('upgrade')
  .describe('Upgrade dependencies')
  .option('--dir', 'Project folder', '.')
  .option('--skip-install', 'Avoid running `yarn install`')
  .action(args => {
    const {dir, 'skip-install': skipInstall = false} = args;
    upgrade({dir, skipInstall});
  });

cli
  .command('provision')
  .describe('Publish a web application')
  .action(provision);

if (process.argv.length === 2) process.argv.push('--help');
cli.parse(process.argv);
