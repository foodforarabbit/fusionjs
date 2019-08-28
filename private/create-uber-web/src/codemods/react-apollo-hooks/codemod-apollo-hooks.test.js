// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {codemodApolloHooks} from './codemod-apollo-hooks';

jest.mock('../../utils/get-latest-version.js', () => {
  return {
    getLatestVersion() {
      return '^2.0.0';
    },
  };
});

test('fusion apollo hooks', async () => {
  const root = 'fixtures/fusion-apollo-hooks';
  const pkg = `${root}/package.json`;
  const a = `${root}/src/a.js`;
  await writeFile(
    pkg,
    JSON.stringify({
      dependencies: {
        'react-apollo': '1',
      },
    })
  );
  await writeFile(
    a,
    `
import {withApollo, Query, getDataFromTree, createClient} from 'react-apollo';
import {MockedProvider} from 'react-apollo/test-utils';

describe('test', () => {
  it('test', async () => {
    const el = <MockedProvider></MockedProvider>;
    await delay(0);
    await test();
  })
})
`
  );
  await codemodApolloHooks({dir: root, strategy: 'latest'});
  const newPkg = await readFile(pkg);
  const newFile = await readFile(a);
  await removeFile(root);
  await removeFile(a);
  expect(newPkg).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {
        \\"@apollo/react-hooks\\": \\"^2.0.0\\",
        \\"@apollo/react-testing\\": \\"^2.0.0\\",
        \\"@apollo/react-components\\": \\"^2.0.0\\",
        \\"@apollo/react-common\\": \\"^2.0.0\\",
        \\"@apollo/react-hoc\\": \\"^2.0.0\\",
        \\"@apollo/react-ssr\\": \\"^2.0.0\\"
      }
    }"
  `);
  expect(newFile).toMatchInlineSnapshot(`
    "
    import {withApollo} from '@apollo/react-hoc';
    import {Query} from '@apollo/react-components';
    import {getDataFromTree} from '@apollo/react-ssr';
    import { createClient, MockedProvider } from '@apollo/react-testing';

    import {act} from 'react-dom/test-utils';

    describe('test', () => {
      it('test', async () => {
        const el = <MockedProvider></MockedProvider>;
        await act(async () => {
          await delay(0);
        });
        await test();
      })
    })
    "
  `);
});
