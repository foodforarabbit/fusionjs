// @flow
/* eslint-env node */
import path from 'path';
import createErrorTransform from '../src/utils/create-error-transform';

const regularError = new Error('hi from regular error');
regularError.stack = `Error: hello world
        at test (test.es5.js:4:13)
        at Object.<anonymous> (test.es5.js:13:1)`;

const regularErrorSourceHasWithMapSuffix = new Error('hi from regular error');
// put additional 'with-map' in base name too to ensure omly last occurence removed
regularErrorSourceHasWithMapSuffix.stack = `Error: hello world
        at test (test-with-map-haha.es5-with-map.js:4:13)
        at Object.<anonymous> (test-with-map-haha.es5-with-map.js:13:1)`;

const error = new Error('hi from source and line error');
// $FlowFixMe - testing the legacy Error pattern
delete error.stack;
// $FlowFixMe - testing the legacy Error pattern
const sourceAndLineError = Object.assign(error, {
  source: 'test.es5.js',
  line: 4,
  col: 13,
});

const expectedRegularErrorTransformed = {
  message: 'hi from regular error',
  stack: `test at test.js:2:14
    Object.<anonymous> at test.js:6:1`,
  error: regularError,
};

const expectedRegularErrorSourceHasWithMapSuffixTransformed = {
  message: 'hi from regular error',
  stack: `test at test-with-map-haha.js:2:14
    Object.<anonymous> at test-with-map-haha.js:6:1`,
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
  error: sourceAndLineError,
};

const expectedSourceAndLineErrorTransformedNoMap = {
  message: 'hi from source and line error',
  stack: `unknown function name at test.es5.js:4:13`,
  error: sourceAndLineError,
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

test('createErrorTransform - regular error, source has `with-map` suffix', async () => {
  expect.assertions(1);
  const transformError = createErrorTransform({
    path: path.join(process.cwd(), `__fixtures-with-map-suffix__`),
    ext: '.map',
  });
  const transformed = await transformError({
    error: regularErrorSourceHasWithMapSuffix,
  });
  expect(transformed).toEqual(
    expectedRegularErrorSourceHasWithMapSuffixTransformed
  );
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
  const transformed = await transformError({error: sourceAndLineError});
  expect(transformed).toEqual(expectedSourceAndLineErrorTransformed);
});

test('createErrorTransform - source and line error, no map', async () => {
  expect.assertions(1);
  const transformError = createErrorTransform({
    path: path.join(process.cwd(), `__wrong__`),
    ext: '.map',
  });
  const transformed = await transformError({error: sourceAndLineError});
  expect(transformed).toEqual(expectedSourceAndLineErrorTransformedNoMap);
});
