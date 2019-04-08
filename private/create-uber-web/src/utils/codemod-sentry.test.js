/* @flow */

import {remove} from 'fs-extra';
import {writeFile, readFile} from '@dubstep/core';
import {codemodSentry} from './codemod-sentry.js';

test('codemodSentry', async () => {
  const dir = '__codemodded_sentry__';
  const file = `${dir}/src/config/sentry.js`;
  await writeFile(`${file}`, '{{name}}');
  await codemodSentry({name: dir});
  await expect(readFile(file)).resolves.toEqual(dir);
  await remove(dir);
});
