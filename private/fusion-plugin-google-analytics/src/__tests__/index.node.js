// @flow
import Plugin from '../server';

test('ga plugin on the server', () => {
  expect(typeof Plugin.middleware).toBe('function');
  // $FlowFixMe
  const api = Plugin.provides();
  expect(typeof api.identify).toBe('function');
  expect(typeof api.track).toBe('function');
  expect(typeof api.pageview).toBe('function');
  expect(api.identify).toThrow();
  expect(api.track).toThrow();
  expect(api.pageview).toThrow();
});

test('ga plugin server middleware with element', done => {
  // $FlowFixMe
  const middleware = Plugin.middleware();
  expect.assertions(1);
  const ctx = {
    element: true,
    template: {
      head: {
        push(content): void {
          expect(typeof content).toBe('object');
        },
      },
    },
  };
  middleware(
    // $FlowFixMe
    ctx,
    // $FlowFixMe
    (): void => {
      done();
    }
  );
});

test('ga plugin server middleware with no element', done => {
  // $FlowFixMe
  const middleware = Plugin.middleware();
  const ctx = {element: false};
  middleware(
    // $FlowFixMe
    ctx,
    // $FlowFixMe
    (): void => {
      done();
    }
  );
});
