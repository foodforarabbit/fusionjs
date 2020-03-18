// @flow
/* eslint-env node */
import path from 'path';
import createErrorTransform from '../src/utils/create-error-transform';

const regularError = new Error('hi from regular error');
regularError.stack = `Error: hello world
        at test (test.es5.js:4:13)
        at Object.<anonymous> (test.es5.js:13:1)`;

const sourceAndLineError = {
  message: 'hi from source and line error',
  source: `test.es5.js`,
  line: 4,
  col: 13,
};

const expectedRegularErrorTransformed = {
  message: 'hi from regular error',
  stack: `test at test.js:2:14
    Object.<anonymous> at test.js:6:1`,
  error: regularError,
};

const expectedRegularErrorTransformedNoMap = {
  message: 'hi from regular error',
  stack: `test at test.es5.js:4:13
    Object.<anonymous> at test.es5.js:13:1`,
  error: regularError,
};

const expectedSourceAndLineErrorTransformed = {
  message: 'hi from source and line error',
  stack: `unknown function name at test.js:2:14`,
};

const expectedSourceAndLineErrorTransformedNoMap = {
  message: 'hi from source and line error',
  stack: `unknown function name at test.es5.js:4:13`,
};

test('createErrorTransform - regular error', async () => {
  expect.assertions(1);
  const transformError = createErrorTransform({
    path: path.join(process.cwd(), `__fixtures__`),
    ext: '.map',
  });
  const transformed = await transformError({error: regularError});
  expect(transformed).toEqual(expectedRegularErrorTransformed);
});

test('createErrorTransform - regular error, no map', async () => {
  expect.assertions(1);
  const transformError = createErrorTransform({
    path: path.join(process.cwd(), `__wrong__`),
    ext: '.map',
  });
  const transformed = await transformError({error: regularError});
  expect(transformed).toEqual(expectedRegularErrorTransformedNoMap);
});

test('createErrorTransform - source and line error', async () => {
  expect.assertions(1);
  const transformError = createErrorTransform({
    path: path.join(process.cwd(), `__fixtures__`),
    ext: '.map',
  });
  const transformed = await transformError(sourceAndLineError);
  expect(transformed).toEqual(expectedSourceAndLineErrorTransformed);
});

test('createErrorTransform - source and line error, no map', async () => {
  expect.assertions(1);
  const transformError = createErrorTransform({
    path: path.join(process.cwd(), `__wrong__`),
    ext: '.map',
  });
  const transformed = await transformError(sourceAndLineError);
  expect(transformed).toEqual(expectedSourceAndLineErrorTransformedNoMap);
});
