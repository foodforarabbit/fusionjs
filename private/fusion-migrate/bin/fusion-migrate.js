#!/usr/bin/env node

const args = require('args');
const migrate = require('../src/migrate.js');
const upgrade = require('../src/upgrade.js');

args.command('migrate', 'run an automated migration', migrate);
args.command('upgrade', 'upgrade to latest scaffold', upgrade);
args.option('pause', 'pause on each step', false);
args.option('steps', 'run specific migration step(s)', []);
args.option('skip-steps', 'skip specific migration step(s)', []);

args.command('show-steps', 'list available steps', () => console.log('TODO'));
args.command('report', 'report current migration report', () =>
  console.log('TODO')
);

args.parse(process.argv, {
  name: 'fusion-migrate',
});
