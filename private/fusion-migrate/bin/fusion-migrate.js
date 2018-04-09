#!/usr/bin/env node

const args = require('args');
const migrate = require('../src/migrate.js');

args.command('migrate', 'run an automated migration', migrate);
args.option('pause', 'pause on each step', true);
args.option('step', 'run specific migration step');

args.command('show-steps', 'list available steps', () => console.log('TODO'));
args.command('report', 'report current migration report', () =>
  console.log('TODO')
);

args.parse(process.argv, {
  name: 'fusion-migrate',
});
