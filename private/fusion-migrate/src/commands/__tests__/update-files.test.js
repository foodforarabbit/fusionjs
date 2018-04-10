const fs = require('fs');
const path = require('path');
const util = require('util');
const tmp = require('tmp');
const updateFiles = require('../update-files.js');

const ncp = util.promisify(require('ncp'));

test('updateFiles', async () => {
  const destDir = tmp.dirSync().name;
  const srcDir = path.join(
    __dirname,
    '../../__fixtures__/update-files-src-fixture'
  );
  await ncp(
    path.join(__dirname, '../../__fixtures__/update-files-dest-fixture'),
    destDir
  );
  await updateFiles({
    srcDir,
    destDir,
    add: ['src/main.js', '.eslintrc.js'],
    remove: ['src/something.js', 'gulpfile.js'],
  });

  expect(fs.existsSync(path.join(destDir, 'src/main.js'))).toEqual(true);
  expect(fs.existsSync(path.join(destDir, '.eslintrc.js'))).toEqual(true);
  expect(fs.existsSync(path.join(destDir, 'src/something.js'))).toEqual(false);
  expect(fs.existsSync(path.join(destDir, 'gulpfile.js'))).toEqual(false);
});
