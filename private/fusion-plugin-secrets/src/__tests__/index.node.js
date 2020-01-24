// @flow
/* eslint-env node */
import path from 'path';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import SecretsPlugin, {
  DevSecretsToken,
  SecretsLocationToken,
  SecretsToken,
} from '../index.js';

test('Server Client - development', done => {
  global.__DEV__ = true;
  let app = new App('el', el => el);
  app.register(SecretsToken, SecretsPlugin);
  try {
    getSimulator(app);
  } catch (e) {
    expect(e).toBeTruthy();
  }

  app = new App('el', el => el);
  app.register(SecretsToken, SecretsPlugin);
  app.register(DevSecretsToken, {a: 'test-value'});
  app.middleware({secrets: SecretsToken}, ({secrets}) => {
    expect(secrets.get('a')).toBe('test-value');
    expect(secrets.get('a', 'default')).toBe('test-value');
    expect(secrets.get('b')).toBe(undefined);
    expect(secrets.get('b', 'default')).toBe('default');
    done();
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('Server Client - production', done => {
  global.__DEV__ = false;
  const app = new App('el', el => el);
  app.register(SecretsToken, SecretsPlugin);
  app.register(DevSecretsToken, {a: 'fail'});
  app.register(
    SecretsLocationToken,
    path.join(process.cwd(), 'src/__tests__/test-config.json')
  );
  app.middleware({secrets: SecretsToken}, ({secrets}) => {
    expect(secrets.get('a')).toBe('test-value');
    expect(secrets.get('a', 'default')).toBe('test-value');
    expect(secrets.get('b')).toBe(undefined);
    expect(secrets.get('b', 'default')).toBe('default');
    done();
    // process.env.NODE_ENV = oldNodeEnv;
    return (ctx, next) => next();
  });
  getSimulator(app);
});
