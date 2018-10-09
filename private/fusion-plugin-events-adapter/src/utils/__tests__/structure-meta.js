// @flow
import tape from 'tape-cup';
import structureMeta from '../structure-meta';

tape('structureMeta() - base case', t => {
  t.plan(1);
  t.deepEqual(structureMeta(), {}, 'returns empty object if given falsy param');
});

tape('structureMeta() - basics', t => {
  t.plan(1);

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

  t.deepEqual(structureMeta(trackingMeta), expected, 'expected output');
});

tape('structureMeta() - validations', t => {
  t.plan(5);
  t.throws(() => structureMeta({'': 1}), 'No empty keys');
  t.throws(
    () => structureMeta({foo: {}}),
    'No property as objects (no nesting)'
  );
  t.throws(() => structureMeta([]), 'No root arrays');
  t.throws(() => structureMeta({foo: []}), 'No property as arrays');
  t.throws(() => structureMeta({foo: 1.55}), 'No float numbers');
});
