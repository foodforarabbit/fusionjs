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
  const uiGroup = `${root}/src/uber/ui.js`;
  await writeFile(
    uiGroup,
    `
  export default function ui(app) {
    app.register(A, B);
  }
  `
  );
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
  const newUIGroup = await readFile(uiGroup);
  await removeFile(root);
  await removeFile(a);
  await removeFile(uiGroup);
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
  expect(newUIGroup).toMatchInlineSnapshot(`
        "
          import {SkipPrepareToken} from 'fusion-react';
          export default function ui(app) {
            app.register(A, B);
            app.register(SkipPrepareToken, true);
          }
          "
    `);
});

test('fusion apollo hooks - does not double register SkipPrepareToken', async () => {
  const root = 'fixtures/fusion-apollo-hooks';
  const pkg = `${root}/package.json`;
  const uiGroup = `${root}/src/uber/ui.js`;
  await writeFile(
    uiGroup,
    `
  import {SkipPrepareToken} from 'fusion-react';
  export default function ui(app) {
    app.register(A, B);
    app.register(SkipPrepareToken, true);
  }
  `
  );
  await writeFile(
    pkg,
    JSON.stringify({
      dependencies: {
        'react-apollo': '1',
      },
    })
  );
  await codemodApolloHooks({dir: root, strategy: 'latest'});
  const newPkg = await readFile(pkg);
  const newUIGroup = await readFile(uiGroup);
  await removeFile(root);
  await removeFile(uiGroup);
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
  expect(newUIGroup).toMatchInlineSnapshot(`
    "
      import {SkipPrepareToken} from 'fusion-react';
      export default function ui(app) {
        app.register(A, B);
        app.register(SkipPrepareToken, true);
      }
      "
  `);
});
