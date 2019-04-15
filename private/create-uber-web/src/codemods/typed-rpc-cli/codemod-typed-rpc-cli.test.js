// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {codemodTypedRPCCLI} from './codemod-typed-rpc-cli';

jest.mock('../../utils/get-latest-version.js', () => {
  return {
    getLatestVersion() {
      return '^2.0.0';
    },
  };
});

test('typedRPCClI codemod', async () => {
  const root = 'fixtures/typed-rpc-cli';
  const pkg = `${root}/package.json`;
  const main = `${root}/src/main.js`;
  const otherFile = `${root}/src/graphql/file.js`;
  await writeFile(
    pkg,
    JSON.stringify({
      devDependencies: {
        '@uber/typed-rpc-cli': '^1.0.0',
      },
    })
  );
  await writeFile(
    main,
    `
    import thing from './gen/test.js'; 
    import type {ThingType} from './gen/tmp.js'; 
    import tmp from 'package';
  `
  );
  await writeFile(
    otherFile,
    `
    import thing from '../gen/test.js'; 
    import type {ThingType} from '../gen/tmp.js'; 
    import tmp from 'package';
    `
  );
  await codemodTypedRPCCLI({dir: root, strategy: 'latest'});
  const data = await readFile(pkg);
  const newMain = await readFile(main);
  await removeFile(root);
  await removeFile(main);
  expect(data).toMatchInlineSnapshot(`
"{
  \\"devDependencies\\": {
    \\"@uber/typed-rpc-cli\\": \\"^2.0.0\\"
  },
  \\"dependencies\\": {}
}"
`);
  expect(newMain).toMatchInlineSnapshot(`
"
    import thing from \\"./__generated__/test.js\\"; 
    import type {Thing as ThingType} from \\"./__generated__/tmp.js\\"; 
    import tmp from 'package';
  "
`);
});
