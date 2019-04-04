// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {installIntrospect} from './installation.js';

jest.mock('../../utils/get-latest-version.js', () => ({
  getLatestVersion: () => Promise.resolve('^1.0.0'),
}));

test('introspect codemod', async () => {
  const contents = `
import App from 'fusion-core';
export default async function start() {
  const app = new App('test', el => el);
  return app;
}`;
  const root = 'fixtures/introspect-registration';
  const fixture = `${root}/src/main.js`;
  await writeFile(`${root}/package.json`, '{"name": "foo"}');
  await writeFile(fixture, contents);
  await installIntrospect({dir: root, strategy: 'latest'});
  const newContents = await readFile(fixture);
  // $FlowFixMe
  expect(newContents).toMatchInlineSnapshot(`
"
import App from 'fusion-core';
import introspect from 'fusion-plugin-introspect';
import metricsStore from '@uber/fusion-metrics';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
export default async function start() {
  const app = new App('test', el => el);

  app.register(introspect(app, {
    deps: {
      heatpipe: HeatpipeToken
    },

    store: metricsStore()
  }));

  return app;
}"
`);
  await removeFile(root);
});

test('introspect codemod w/ heatpipe token', async () => {
  const contents = `
import App from 'fusion-core';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
export default async function start() {
  const app = new App('test', el => el);
  return app;
}`;
  const root = 'fixtures/introspect-registration-with-heatpipe';
  const fixture = `${root}/src/main.js`;
  await writeFile(`${root}/package.json`, '{"name": "foo"}');
  await writeFile(fixture, contents);
  await installIntrospect({dir: root, strategy: 'latest'});
  const newContents = await readFile(fixture);
  // $FlowFixMe
  expect(newContents).toMatchInlineSnapshot(`
"
import App from 'fusion-core';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
import introspect from 'fusion-plugin-introspect';
import metricsStore from '@uber/fusion-metrics';
export default async function start() {
  const app = new App('test', el => el);

  app.register(introspect(app, {
    deps: {
      heatpipe: HeatpipeToken
    },

    store: metricsStore()
  }));

  return app;
}"
`);
  await removeFile(root);
});

test('introspect codemod overwrites', async () => {
  const contents = `
import App from 'fusion-core';
export default async function start() {
  const app = new App('test', el => el);

  app.register(introspect(foo));

  return app;
}`;
  const root = 'fixtures/introspect-registration-overwrites';
  const fixture = `${root}/src/main.js`;
  await writeFile(`${root}/package.json`, '{"name": "foo"}');
  await writeFile(fixture, contents);
  await installIntrospect({dir: root, strategy: 'latest'});
  const newContents = await readFile(fixture);
  // $FlowFixMe
  expect(newContents).toMatchInlineSnapshot(`
"
import App from 'fusion-core';
import introspect from 'fusion-plugin-introspect';
import metricsStore from '@uber/fusion-metrics';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
export default async function start() {
  const app = new App('test', el => el);

  app.register(introspect(app, {
    deps: {
      heatpipe: HeatpipeToken
    },

    store: metricsStore()
  }));

  return app;
}"
`);
  await removeFile(root);
});

test('introspect codemod csrf protection whitelist', async () => {
  const contents = `__NODE__ && app.register(CsrfIgnoreRoutesToken, ['/_errors']);`;
  const root = 'fixtures/introspect-registration-csrf-whitelist';
  const fixture = `${root}/src/main.js`;
  await writeFile(`${root}/package.json`, '{"name": "foo"}');
  await writeFile(fixture, contents);
  await installIntrospect({dir: root, strategy: 'latest'});
  const newContents = await readFile(fixture);
  // $FlowFixMe
  expect(newContents).toMatchInlineSnapshot(`
"import introspect from 'fusion-plugin-introspect';
import metricsStore from '@uber/fusion-metrics';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
__NODE__ && app.register(CsrfIgnoreRoutesToken, ['/_errors', \\"/_diagnostics\\"]);"
`);
  await removeFile(root);
});

test('introspect codemod csrf protection whitelist idempotency', async () => {
  const contents = `__NODE__ && app.register(CsrfIgnoreRoutesToken, ['/_errors', '/_diagnostics']);`;
  const root = 'fixtures/introspect-registration-csrf-whitelist';
  const fixture = `${root}/src/main.js`;
  await writeFile(`${root}/package.json`, '{"name": "foo"}');
  await writeFile(fixture, contents);
  await installIntrospect({dir: root, strategy: 'latest'});
  const newContents = await readFile(fixture);
  // $FlowFixMe
  expect(newContents).toMatchInlineSnapshot(`
"import introspect from 'fusion-plugin-introspect';
import metricsStore from '@uber/fusion-metrics';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
__NODE__ && app.register(CsrfIgnoreRoutesToken, ['/_errors', '/_diagnostics']);"
`);
  await removeFile(root);
});
