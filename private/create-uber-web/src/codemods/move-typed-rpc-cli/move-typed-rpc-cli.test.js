// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {moveTypedRPCCLI} from './move-typed-rpc-cli';

jest.mock('../../utils/get-latest-version.js', () => ({
  getLatestVersion: () => Promise.resolve('^1.0.0'),
}));

test('moveTypedRPCCLI', async () => {
  const root = 'fixtures/move-typed-rpc-cli';
  const fixture = `${root}/package.json`;
  await writeFile(
    fixture,
    `{
    "dependencies": {},
    "devDependencies": {
      "@uber/typed-rpc-cli": "0.0.0"
    }
  }`
  );
  await moveTypedRPCCLI({dir: root, strategy: 'latest'});
  const result = await readFile(fixture);
  expect(result).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {
        \\"@uber/typed-rpc-cli\\": \\"^1.0.0\\"
      },
      \\"devDependencies\\": {}
    }"
  `);
  await removeFile(root);
});
