const fs = require('fs');
const path = require('path');
const execa = require('execa');
const tmp = require('tmp');
const format = require('../format.js');

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
