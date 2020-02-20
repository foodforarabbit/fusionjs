// @flow
/* eslint-env node */
import path from 'path';
import createErrorTransform from '../src/create-error-transform';

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

test('createErrorTransform - basics', async () => {
  expect.assertions(1);
  const transformError = createErrorTransform({
    path: path.join(process.cwd(), `__fixtures__`),
    ext: '.map',
  });
  const transformed = await transformError({error: mockError});
  expect(transformed).toEqual(expectedTransformed);
});
