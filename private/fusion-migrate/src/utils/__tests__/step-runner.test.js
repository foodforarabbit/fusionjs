const assert = require('assert');
const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const StepRunner = require('../step-runner.js');

test('steprunner', async () => {
  const dir = tmp.dirSync().name;
  const runner = new StepRunner(dir, {version: 14, lastCompletedStep: 'lint'});
  let doneWithAsync = false;
  let ranSyncTask = false;
  const syncTask = () => {
    ranSyncTask = true;
  };
  const asyncTask = () => {
    return Promise.resolve().then(() => {
      doneWithAsync = true;
    });
  };

  const failSync = () => {
    throw new Error('fail sync');
  };
  const failAsync = () => Promise.reject(new Error('fail async'));

  try {
    await runner.step(syncTask);
    throw new Error('Should not get here');
  } catch (e) {
    assert.equal(e.message, 'Internal Error: syncTask is missing a step id');
  }

  assert.ok(await runner.step(syncTask, 'sync'));
  assert.equal(ranSyncTask, true);
  assert.ok(await runner.step(asyncTask, 'async'));
  assert.equal(doneWithAsync, true);

  const reportPath = path.join(dir, 'migration-report.json');

  assert.equal(await runner.step(failSync, 'fail-sync'), false);
  let report = JSON.parse(fs.readFileSync(reportPath).toString());
  assert.ok(report.completedSteps.includes('sync'));
  assert.ok(report.completedSteps.includes('async'));
  assert.equal(report.completedSteps.length, 2);
  assert.equal(report.failedStep, 'fail-sync');
  assert.equal(report.error.message, 'fail sync');
  assert.equal(typeof report.error.stack, 'string');
  fs.unlinkSync(reportPath);

  assert.equal(await runner.step(failAsync, 'fail-async'), false);
  report = JSON.parse(fs.readFileSync(reportPath).toString());
  assert.ok(report.completedSteps.includes('sync'));
  assert.ok(report.completedSteps.includes('async'));
  assert.equal(report.completedSteps.length, 2);
  assert.equal(report.failedStep, 'fail-async');
  assert.equal(report.error.message, 'fail async');
  assert.equal(typeof report.error.stack, 'string');
});
