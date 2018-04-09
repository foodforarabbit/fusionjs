const assert = require('assert');
const tmp = require('tmp');
const {migrate} = require('../migrate.js');

test('migrate', async () => {
  const destDir = tmp.dirSync().name;
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

  let steps = [
    {step: syncTask, id: 'sync-task'},
    {step: asyncTask, id: 'async-task'},
  ];

  assert.equal(await migrate({destDir, steps}), true);

  assert.equal(ranSyncTask, true);
  assert.equal(doneWithAsync, true);

  steps = [
    {step: syncTask, id: 'sync-task'},
    {step: failSync, id: 'fail-sync'},
    {step: asyncTask, id: 'async-task'},
  ];

  ranSyncTask = false;
  doneWithAsync = false;

  assert.equal(await migrate({destDir, steps}), false);

  assert.equal(ranSyncTask, true);
  assert.equal(doneWithAsync, false);
});
