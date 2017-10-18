/* eslint-env node */
import path from 'path';
import test from 'tape-cup';
import SecretsPlugin from '../../index.js';

test('Server Client - development', t => {
  t.throws(() => SecretsPlugin());

  const devSecrets = SecretsPlugin({devValues: {a: 'test-value'}}).of();
  devSecrets.init().then(() => {
    t.equals(devSecrets.get('a'), 'test-value');
    t.equals(devSecrets.get('a', 'default'), 'test-value');
    t.equals(devSecrets.get('b'), undefined);
    t.equals(devSecrets.get('b', 'default'), 'default');

    t.end();
  });
});

test('Server Client - production', t => {
  const oldNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  t.doesNotThrow(() => SecretsPlugin());
  t.throws(() => SecretsPlugin({devValues: {a: 'test-value'}}));

  const secrets = SecretsPlugin({
    secretsPath: path.join(process.cwd(), 'src/__tests__/test-config.json'),
  }).of();

  secrets.init().then(() => {
    t.equals(secrets.get('a'), 'test-value');
    t.equals(secrets.get('a', 'default'), 'test-value');
    t.equals(secrets.get('b'), undefined);
    t.equals(secrets.get('b', 'default'), 'default');

    process.env.NODE_ENV = oldNodeEnv;

    t.end();
  });
});
