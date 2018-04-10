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

test('diffStep continue', async () => {
  require('inquirer').prompt.mockImplementation(opts => {
    expect(opts.type).toEqual('list');
    expect(opts.message).toEqual('Finished running test');
    expect(opts.choices).toMatchObject(['Continue', 'Show Diff', 'Quit']);
    return {[opts.name]: 'Continue'};
  });
  const dir = await setup();
  expect(await diffStep('test', dir)).toEqual(true);
  const commit = await execa.shell(`git log -1 --pretty=%B`, {cwd: dir});
  expect(commit.stdout).toMatch('Step "test"');
});

test('diffStep Show Diff', async () => {
  const steps = ['Show Diff', 'Continue'];
  require('inquirer').prompt.mockImplementation(opts => {
    expect(opts.type).toEqual('list');
    expect(opts.message).toEqual('Finished running test');
    expect(opts.choices).toMatchObject(['Continue', 'Show Diff', 'Quit']);
    return {[opts.name]: steps.shift()};
  });
  const dir = await setup();
  expect(await diffStep('test', dir)).toEqual(true);
  expect(steps.length).toEqual(0);
  const commit = await execa.shell(`git log -1 --pretty=%B`, {cwd: dir});
  expect(commit.stdout).toMatch('Step "test"');
});

test('diffStep quit', async () => {
  const steps = ['Quit'];
  require('inquirer').prompt.mockImplementation(opts => {
    expect(opts.type).toEqual('list');
    expect(opts.message).toEqual('Finished running test');
    expect(opts.choices).toMatchObject(['Continue', 'Show Diff', 'Quit']);
    return {[opts.name]: steps.shift()};
  });
  const dir = await setup();
  try {
    await diffStep('test', dir);
    throw new Error('ensure catch');
  } catch (e) {
    expect(e.message).toMatch('User quit after running step: test');
  }
  expect(steps.length).toEqual(0);
  const commit = await execa.shell(`git log -1 --pretty=%B`, {cwd: dir});
  expect(commit.stdout).toMatch('Initial commit');
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
