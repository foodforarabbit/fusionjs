// TODO: unskip tests. Skipping now because there are issues with running git commands on CI
const assert = require('assert');
const path = require('path');
const getJSFiles = require('../get-js-files.js');

test.skip('get js files', async () => {
  const files = await getJSFiles(
    path.join(__dirname, '../../__fixtures__/js-files-fixture')
  );
  assert.equal(files.length, 4, 'only finds js files');
  assert.ok(files.includes('top.js'), 'includes top level js files');
  assert.ok(
    files.includes('src/main.js', 'includes js files nested in directories')
  );
  assert.ok(files.includes('top.jsx'), 'includes top level js files');
  assert.ok(
    files.includes('src/main.jsx', 'includes js files nested in directories')
  );
});
