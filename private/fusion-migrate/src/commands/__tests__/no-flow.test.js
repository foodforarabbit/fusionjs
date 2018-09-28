const noFlow = require('../no-flow.js');

jest.mock('../../utils/get-js-files.js', () => jest.fn());
jest.mock('fs', () => {
  return {
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
  };
});

test('no flow - has noflow declaration', async () => {
  require('../../utils/get-js-files.js').mockImplementationOnce(() => {
    return ['test.js'];
  });
  const destDir = 'testdir';
  const initialContents = `
    // @noflow
    test
  `;
  const fs = require('fs');
  fs.readFileSync.mockReturnValueOnce(initialContents);
  await noFlow({destDir});
  expect(fs.readFileSync.mock.calls).toHaveLength(1);
  expect(fs.readFileSync.mock.calls[0][0]).toEqual('testdir/test.js');
  expect(fs.writeFileSync.mock.calls).toHaveLength(0);
  fs.readFileSync.mockReset();
  fs.writeFileSync.mockReset();
});

test('no flow - has flow declaration', async () => {
  require('../../utils/get-js-files.js').mockImplementationOnce(() => {
    return ['test.js'];
  });
  const destDir = 'testdir';
  const initialContents = `
    // @flow
    test
  `;
  const fs = require('fs');
  fs.readFileSync.mockReturnValueOnce(initialContents);
  await noFlow({destDir});
  expect(fs.readFileSync.mock.calls).toHaveLength(1);
  expect(fs.readFileSync.mock.calls[0][0]).toEqual('testdir/test.js');
  expect(fs.writeFileSync.mock.calls).toHaveLength(0);
  fs.readFileSync.mockReset();
  fs.writeFileSync.mockReset();
});
test('no flow - no declaration', async () => {
  require('../../utils/get-js-files.js').mockImplementationOnce(() => {
    return ['test.js'];
  });
  const destDir = 'testdir';
  const initialContents = `
    test
  `;
  const fs = require('fs');
  fs.readFileSync.mockReturnValueOnce(initialContents);
  await noFlow({destDir});
  expect(fs.readFileSync.mock.calls).toHaveLength(1);
  expect(fs.readFileSync.mock.calls[0][0]).toEqual('testdir/test.js');
  expect(fs.writeFileSync.mock.calls).toHaveLength(1);
  expect(fs.writeFileSync.mock.calls[0][0]).toEqual('testdir/test.js');
  expect(fs.writeFileSync.mock.calls[0][1]).toEqual(
    '// @noflow\n' + initialContents
  );
  fs.readFileSync.mockReset();
  fs.writeFileSync.mockReset();
});
