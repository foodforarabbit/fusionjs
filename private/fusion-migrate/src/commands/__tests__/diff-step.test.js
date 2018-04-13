const fs = require('fs');
const path = require('path');
const execa = require('execa');
const tmp = require('tmp');
const diffStep = require('../diff-step.js');

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn(),
  };
});

jest.mock('../../log.js', () => jest.fn());

test('diffStep continue', async () => {
  require('inquirer').prompt.mockImplementation(opts => {
    expect(opts.type).toEqual('confirm');
    expect(
      require('../../log.js')
        .mock.calls.pop()
        .pop()
    ).toMatch('Finished running step test. Diff shown above');
    expect(opts.message).toMatch('Continue?');
    return {[opts.name]: true};
  });
  const dir = await setup();
  expect(await diffStep('test', dir)).toEqual(true);
  const commit = await execa.shell(`git log -1 --pretty=%B`, {cwd: dir});
  expect(commit.stdout).toMatch('Step "test"');
});

test('diffStep quit', async () => {
  require('inquirer').prompt.mockImplementation(opts => {
    expect(opts.type).toEqual('confirm');
    expect(
      require('../../log.js')
        .mock.calls.pop()
        .pop()
    ).toMatch('Finished running step test. Diff shown above');
    expect(opts.message).toEqual('Continue?');
    return {[opts.name]: false};
  });
  const dir = await setup();
  try {
    await diffStep('test', dir);
    throw new Error('ensure catch');
  } catch (e) {
    expect(e.message).toMatch('User quit after running step: test');
  }
  const commit = await execa.shell(`git log -1 --pretty=%B`, {cwd: dir});
  expect(commit.stdout).toMatch('Initial commit');
});

test('diffStep with no changes', async () => {
  const dir = tmp.dirSync().name;
  fs.writeFileSync(path.join(dir, 'test.json'), '{}');
  await execa.shell('git init && git add . && git commit -m "Initial commit"', {
    cwd: dir,
  });
  expect(await diffStep('test', dir)).toEqual(false);
});

async function setup() {
  const dir = tmp.dirSync().name;
  fs.writeFileSync(path.join(dir, 'test.json'), '{}');
  await execa.shell('git init && git add . && git commit -m "Initial commit"', {
    cwd: dir,
  });
  fs.writeFileSync(path.join(dir, 'another.json'), '{}');
  return dir;
}
