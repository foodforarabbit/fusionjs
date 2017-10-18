import test from 'tape-cup';
import SecretsPlugin from '../../index.js';

test('Browser Client', t => {
  t.throws(() => SecretsPlugin().of());
  t.end();
});
