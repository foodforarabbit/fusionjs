// @flow
/* eslint-env node */
import path from 'path';
import tape from 'tape-cup';
import createErrorTransform from '../utils/create-error-transform';

const mockError = {
  message: 'hello world',
  stack: `Error: hello world
        at test (test.es5.js:4:13)
        at Object.<anonymous> (test.es5.js:13:1)`,
};

const expectedTransformed = {
  message: 'hello world',
  stack: `test at test.js:2:14
    Object.<anonymous> at test.js:6:1`,
};

tape('createErrorTransform - basics', async t => {
  t.plan(1);
  const transformError = createErrorTransform({
    path: path.join(process.cwd(), `src/__fixtures__`),
    ext: '.map',
  });
  const transformed = await transformError({error: mockError});
  t.deepEqual(transformed, expectedTransformed, 'Error transformed correctly');
  t.end();
});
