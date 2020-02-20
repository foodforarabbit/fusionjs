// @flow
import structureMeta from '../src/utils/structure-meta';

test('structureMeta() - base case', () => {
  expect.assertions(1);
  expect(structureMeta()).toEqual({});
});

test('structureMeta() - basics', () => {
  expect.assertions(1);

  const trackingMeta = {
    uuid: '53a9382b-308a-4330-bcb7-413843e621b2',
    awesomeness: 87,
    optInAwesome: true,
  };

  const expected = {
    meta: {
      uuid: '53a9382b-308a-4330-bcb7-413843e621b2',
    },
    meta_long: {
      awesomeness: 87,
    },
    meta_bool: {
      optInAwesome: true,
    },
  };

  expect(structureMeta(trackingMeta)).toEqual(expected);
});

test('structureMeta() - validations', () => {
  expect.assertions(5);
  expect(() => structureMeta({'': 1})).toThrow();
  expect(() => structureMeta({foo: {}})).toThrow();
  expect(() => structureMeta([])).toThrow();
  expect(() => structureMeta({foo: []})).toThrow();
  expect(() => structureMeta({foo: 1.55})).toThrow();
});
