#!/usr/bin/env node

const args = require('args');
const reset = require('../src/reset.js');
const migrate = require('../src/migrate.js');
const upgrade = require('../src/upgrade.js');
const updateFonts = require('../src/update-fonts.js');

args.command('reset', 'reset from a failed migration', reset);
args.command('migrate', 'run an automated migration', migrate);
args.command('upgrade', 'upgrade to latest scaffold', upgrade);
args.option('pause', 'pause on each step', false);
args.option('steps', 'run specific migration step(s)', []);
args.option('skip-steps', 'skip specific migration step(s)', []);

args.command('show-steps', 'list available steps', () => console.log('TODO'));
args.command('report', 'report current migration report', () =>
  console.log('TODO')
);

args.command('update-fonts', 'update fonts', updateFonts);

args.parse(process.argv, {
  name: 'fusion-migrate',
});
