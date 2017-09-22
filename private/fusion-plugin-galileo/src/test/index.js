const test = require('tape');

const galileoClient = require('../');

test('Graphene Client', function t(assert) {
  assert.ok(galileoClient, 'exported correctly');

  assert.ok(
    galileoClient.register && galileoClient.meta,
    'should expose plugin interface methods'
  );

  assert.end();
});
