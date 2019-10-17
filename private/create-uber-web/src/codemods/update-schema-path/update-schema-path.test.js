// @flow
import {existsSync} from 'fs';
import {updateSchemaPath} from './update-schema-path';
import {writeFile, readFile, removeFile} from '@dubstep/core';

test('updateSchemaPath', async () => {
  const contents = `{
  "schemaPath": ".graphql/schema.json",
  "extensions": {
    "endpoints": {
      "dev": {
        "url": "http://localhost:3000/graphql",
        "headers": {
          "x-csrf-token": "x"
        }
      }
    }
  }
}`;
  const root = 'fixtures/update-schema-path';
  const fixture = `${root}/.graphqlconfig`;
  await writeFile(fixture, contents);
  await updateSchemaPath({dir: root});
  const result = await readFile(fixture);
  expect(result).toMatchInlineSnapshot(`
    "{
      \\"schemaPath\\": \\".graphql/schema.graphql\\",
      \\"extensions\\": {
        \\"endpoints\\": {
          \\"dev\\": {
            \\"url\\": \\"http://localhost:3000/graphql\\",
            \\"headers\\": {
              \\"x-csrf-token\\": \\"x\\"
            }
          }
        }
      }
    }"
  `);
  await removeFile(root);
});

test('updateSchemaPath no matching file', async () => {
  const root = 'fixtures/update-schema-path';
  const fixture = `${root}/.graphqlconfig`;
  await updateSchemaPath({dir: root});

  expect(existsSync(fixture)).toEqual(false);
  await removeFile(root);
});
