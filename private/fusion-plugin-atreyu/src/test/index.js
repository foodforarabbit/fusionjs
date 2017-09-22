const test = require('tape');

const atreyuClient = require('../');

test('Graphene Client', function t(assert) {
  assert.ok(atreyuClient, 'exported correctly');

  assert.ok(
    atreyuClient.register && atreyuClient.meta,
    'should expose plugin interface methods'
  );

  assert.end();
});
