const assert = require('assert');
const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const migrateCommand = require('../migrate.js');

const {migrate} = migrateCommand;

beforeEach(() => {
  require('../log.js').__clearLogs();
});

jest.mock('../get-steps.js');
jest.mock('../commands/check-migration-version.js');
jest.mock('../log.js');
jest.mock('../utils/scaffold.js');

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

test('migrateCommand', async () => {
  const dir = tmp.dirSync().name;
  let flags = {
    a: false,
    b: false,
  };
  require('../get-steps.js').__setSteps([
    {
      step: () => {
        flags.a = true;
      },
      id: 'a',
    },
    {
      step: () => {
        flags.b = true;
      },
      id: 'b',
    },
  ]);
  expect(
    await migrateCommand('', '', {
      dir,
      steps: [],
      skipSteps: [],
    })
  ).toEqual(true);
  expect(flags.a).toEqual(true);
  expect(flags.b).toEqual(true);
});

test('migrateCommand failure', async () => {
  const dir = tmp.dirSync().name;
  let flags = {
    a: false,
    c: false,
  };
  require('../get-steps.js').__setSteps([
    {
      step: () => {
        flags.a = true;
      },
      id: 'a',
    },
    {
      step: () => {
        throw new Error('FAIL');
      },
      id: 'b',
    },
    {
      step: () => {
        flags.c = true;
      },
      id: 'c',
    },
  ]);
  expect(
    await migrateCommand('', '', {
      dir,
      steps: [],
      skipSteps: [],
    })
  ).toEqual(false);
  expect(flags.a).toEqual(true);
  expect(flags.c).toEqual(false);
});

test('migrateCommand --steps', async () => {
  const dir = tmp.dirSync().name;
  let flags = {
    a: false,
    b: false,
    c: false,
  };
  require('../get-steps.js').__setSteps([
    {
      step: () => {
        flags.a = true;
      },
      id: 'a',
    },
    {
      step: () => {
        flags.b = true;
      },
      id: 'b',
    },
    {
      step: () => {
        flags.c = true;
      },
      id: 'c',
    },
  ]);
  expect(
    await migrateCommand('', '', {
      dir,
      steps: ['a', 'c'],
      skipSteps: [],
    })
  ).toEqual(true);
  expect(flags.a).toEqual(true);
  expect(flags.b).toEqual(false);
  expect(flags.c).toEqual(true);
});

test('migrateCommand --skip-steps', async () => {
  const dir = tmp.dirSync().name;
  let flags = {
    a: false,
    b: false,
    c: false,
  };
  require('../get-steps.js').__setSteps([
    {
      step: () => {
        flags.a = true;
      },
      id: 'a',
    },
    {
      step: () => {
        flags.b = true;
      },
      id: 'b',
    },
    {
      step: () => {
        flags.c = true;
      },
      id: 'c',
    },
  ]);
  expect(
    await migrateCommand('', '', {
      dir,
      steps: [],
      skipSteps: ['b'],
    })
  ).toEqual(true);
  expect(flags.a).toEqual(true);
  expect(flags.b).toEqual(false);
  expect(flags.c).toEqual(true);
});

test('migrateCommand conflict specific steps', async () => {
  expect(
    await migrateCommand('', '', {
      steps: ['something'],
      skipSteps: ['anotherthing'],
    })
  ).toBeFalsy();
  const logs = require('../log.js').__getLogs();
  const message = logs.pop().message;
  expect(message).toMatch('Cant specify both --steps and --skip-steps');
});

test('migrateCommand conflict report and steps', async () => {
  const dir = tmp.dirSync().name;
  fs.writeFileSync(path.join(dir, 'migration-report.json'), '{}');
  expect(
    await migrateCommand('', '', {
      dir,
      steps: ['something'],
      skipSteps: [],
    })
  ).toBeFalsy();
  const logs = require('../log.js').__getLogs();
  const message = logs.pop().message;
  expect(message).toMatch(
    'Cannot run specific steps and recover from previous migration. Run `rm migration-report.json` to remove old migration report'
  );
});

test('migrateCommand with report completedSteps', async () => {
  const dir = tmp.dirSync().name;
  fs.writeFileSync(
    path.join(dir, 'migration-report.json'),
    JSON.stringify({
      completedSteps: ['a', 'b'],
      version: 14,
      failedStep: 'c',
    })
  );
  let flags = {
    a: false,
    b: false,
    c: false,
  };
  require('../get-steps.js').__setSteps([
    {
      step: () => {
        flags.a = true;
      },
      id: 'a',
    },
    {
      step: () => {
        flags.b = true;
      },
      id: 'b',
    },
    {
      step: () => {
        flags.c = true;
      },
      id: 'c',
    },
  ]);
  expect(
    await migrateCommand('', '', {
      dir,
      steps: [],
      skipSteps: [],
    })
  ).toEqual(true);
  expect(flags.a).toEqual(false);
  expect(flags.b).toEqual(false);
  expect(flags.c).toEqual(true);
});

test('migrateCommand with error getting version', async () => {
  require('../commands/check-migration-version.js').__setError('Test Error');
  const dir = tmp.dirSync().name;
  expect(
    await migrateCommand('', '', {
      dir,
      steps: [],
      skipSteps: [],
    })
  ).toEqual(false);
  const logs = require('../log.js').__getLogs();
  const message = logs.pop().message;
  expect(message).toMatch('Test Error');
  require('../commands/check-migration-version.js').__setError(null);
});
