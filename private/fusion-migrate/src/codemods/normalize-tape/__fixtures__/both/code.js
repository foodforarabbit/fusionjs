import test from 'tape';

test('a', assert => assert.ok(1));
test('b', withContext(t => t.ok(1)));
test('c', t => t.fail('errored'));
