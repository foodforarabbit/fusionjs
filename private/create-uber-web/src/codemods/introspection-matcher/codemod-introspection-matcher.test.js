// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {codemodIntrospectionMatcher} from './codemod-introspection-matcher';

jest.mock('../../utils/get-latest-version.js', () => {
  return {
    getLatestVersion() {
      return '^2.0.0';
    },
  };
});

test('fusion codemod introspection matcher', async () => {
  const root = 'fixtures/fusion-apollo';
  const pkg = `${root}/package.json`;
  const main = `${root}/src/main.js`;
  const destFragmentPath = `${root}/.graphql/fragment-types.json`;
  await writeFile(
    pkg,
    JSON.stringify({
      dependencies: {
        'fusion-plugin-apollo': '1',
      },
    })
  );
  await writeFile(
    main,
    `
import {
  ApolloClientToken, 
  ApolloClientPlugin, 
  GetApolloClientCacheToken
} from 'fusion-plugin-apollo';

export default function initGraphql(app) {
  app.register(GetApolloClientCacheToken, () => {});
  app.register(ApolloClientToken, ApolloClientPlugin);
}
`
  );
  await codemodIntrospectionMatcher({dir: root, strategy: 'latest'});
  const newPkg = await readFile(pkg);
  const newMain = await readFile(main);
  const fragmentTypes = await readFile(destFragmentPath);
  await removeFile(root);
  await removeFile(main);
  await removeFile(destFragmentPath);
  expect(newPkg).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {
        \\"fusion-plugin-apollo\\": \\"1\\",
        \\"@uber/graphql-scripts\\": \\"^2.0.0\\",
        \\"apollo-cache-inmemory\\": \\"^2.0.0\\"
      }
    }"
  `);
  expect(newMain).toMatchInlineSnapshot(`
    "
    import {
      ApolloClientToken, 
      ApolloClientPlugin, 
      GetApolloClientCacheToken
    } from 'fusion-plugin-apollo';

    import { defaultDataIdFromObject, InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
    import introspectionQueryResultData from '../.graphql/fragment-types.json';

    export default function initGraphql(app) {
      app.register(ApolloClientToken, ApolloClientPlugin);
      app.register(GetApolloClientCacheToken, ctx => new InMemoryCache({
        addTypename: ctx.method !== 'POST',
        dataIdFromObject: object => object.uuid ? \`\${object.__typename}:\${object.uuid}\` : defaultDataIdFromObject(object),
        fragmentMatcher: new IntrospectionFragmentMatcher({ introspectionQueryResultData }),
      }));
    }
    "
  `);
  expect(fragmentTypes).toMatchInlineSnapshot(`"{}"`);
});
