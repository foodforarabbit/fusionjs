const fs = require('fs');
const path = require('path');
const execa = require('execa');
const tmp = require('tmp');
const format = require('../format.js');

jest.mock('../get-changed-js-files.js', () => jest.fn());

test('format', async () => {
  const unformattedSource = `import a from 'b'; import c from 'd'; const thing = {
    a: 'hello'
  }`;
  const dir = tmp.dirSync().name;
  const testFile = path.join(dir, 'test.js');
  fs.writeFileSync(testFile, unformattedSource);
  expect(fs.readFileSync(testFile).toString()).toMatch(unformattedSource);
  await execa.shell('git init && git add .', {cwd: dir});
  await format(dir);
  const formattedSource = fs.readFileSync(testFile).toString();
  expect(formattedSource).toMatchSnapshot();
});

test('format changedOnly', async () => {
  require('../get-changed-js-files.js').mockImplementationOnce(() => {
    return ['test.js'];
  });
  const unformattedSource = `import a from 'b'; import c from 'd'; const thing = {
    a: 'hello'
  }`;
  const dir = tmp.dirSync().name;
  const testFile = path.join(dir, 'test.js');
  fs.writeFileSync(testFile, unformattedSource);
  expect(fs.readFileSync(testFile).toString()).toMatch(unformattedSource);
  await format(dir, {changedOnly: true});
  const formattedSource = fs.readFileSync(testFile).toString();
  expect(formattedSource).toMatchSnapshot();
  expect(require('../get-changed-js-files.js').mock.calls).toHaveLength(1);
});
