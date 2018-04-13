const fs = require('fs');
const tmp = require('tmp');
const path = require('path');
const util = require('util');
const execa = require('execa');
const getChangedJsFiles = require('../get-changed-js-files.js');

const ncp = util.promisify(require('ncp'));

test('getChangedJsFiles', async () => {
  const dir = tmp.dirSync().name;
  await ncp(path.join(__dirname, '../../__fixtures__/js-files-fixture'), dir);
  await execa.shell(`git init && git add . && git commit -m 'initial commit'`, {
    cwd: dir,
  });
  let files = await getChangedJsFiles(dir);
  expect(files.length).toEqual(0);
  fs.writeFileSync(path.join(dir, 'top.js'), 'console.log()');
  fs.writeFileSync(path.join(dir, 'src/main.js'), 'console.log()');
  fs.writeFileSync(path.join(dir, 'new.js'), 'console.log()');
  files = await getChangedJsFiles(dir);
  expect(files.sort()).toMatchObject(
    ['top.js', 'src/main.js', 'new.js'].sort()
  );
});
