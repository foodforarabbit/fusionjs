#!/usr/bin/env node

const args = require('args');

args.command('migrate', 'run an automated migration', () =>
  console.log('TODO')
);
args.option('pause', 'pause on each step', true);
args.option('step', 'run specific migration step');

args.command('show-steps', 'list available steps', () => console.log('TODO'));
args.command('report', 'report current migration report', () =>
  console.log('TODO')
);

args.parse(process.argv, {
  name: 'fusion-migrate',
});
