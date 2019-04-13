// @flow
/* eslint-env node */
import path from 'path';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import test from 'tape-cup';
import SecretsPlugin, {
  DevSecretsToken,
  SecretsLocationToken,
  SecretsToken,
} from '../index.js';

test('Server Client - development', t => {
  let app = new App('el', el => el);
  app.register(SecretsToken, SecretsPlugin);
  try {
    getSimulator(app);
  } catch (e) {
    t.ok(e, 'should throw in dev with no dev values');
  }

  app = new App('el', el => el);
  app.register(SecretsToken, SecretsPlugin);
  app.register(DevSecretsToken, {a: 'test-value'});
  app.middleware({secrets: SecretsToken}, ({secrets}) => {
    t.equals(secrets.get('a'), 'test-value');
    t.equals(secrets.get('a', 'default'), 'test-value');
    t.equals(secrets.get('b'), undefined);
    t.equals(secrets.get('b', 'default'), 'default');
    t.end();
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('Server Client - production', t => {
  const oldNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const app = new App('el', el => el);
  app.register(SecretsToken, SecretsPlugin);
  app.register(DevSecretsToken, {a: 'fail'});
  app.register(
    SecretsLocationToken,
    path.join(process.cwd(), 'src/__tests__/test-config.json')
  );
  app.middleware({secrets: SecretsToken}, ({secrets}) => {
    t.equals(secrets.get('a'), 'test-value');
    t.equals(secrets.get('a', 'default'), 'test-value');
    t.equals(secrets.get('b'), undefined);
    t.equals(secrets.get('b', 'default'), 'default');
    t.end();
    process.env.NODE_ENV = oldNodeEnv;
    return (ctx, next) => next();
  });
  getSimulator(app);
});
