// @flow
import codemod from './enhancer';
import path from 'path';
import {writeFile, readFile, remove} from 'fs-extra';

jest.mock('@dubstep/core', () => {
  // $FlowFixMe
  const actual = require.requireActual('@dubstep/core');
  return {
    ...actual,
    readFile: jest.fn(() => {
      return JSON.stringify({
        dependencies: {
          'fusion-plugin-csrf-protection-react': '1',
        },
      });
    }),
    exec: jest.fn(),
    withJsFiles: (glob, handler) => {
      return actual.withJsFiles('./fixtures/csrf-enhancer/fixture.js', handler);
    },
  };
});

test('csrf protection enhancer codemod', async () => {
  const contents = `
import CsrfProtectionPlugin, {
  FetchForCsrfToken,
  CsrfIgnoreRoutesToken
} from "fusion-plugin-csrf-protection-react";
import fetch from "unfetch";
import App from "fusion-core";
export default async function start() {
  const app = new App("test", el => el);
  app.register(FetchToken, CsrfProtectionPlugin);
  __NODE__ && app.register(CsrfIgnoreRoutesToken, ["/_errors"]);
  if (__BROWSER__) {
    app.register(FetchForCsrfToken, unfetch);
  }
  return app;
}`;
  const fixture = 'fixtures/csrf-enhancer/fixture.js';
  await writeFile(fixture, contents);
  await codemod.step();
  const newContents = (await readFile(fixture)).toString();
  // $FlowFixMe
  expect(newContents).toMatchInlineSnapshot(`
"
import CsrfProtectionPlugin, { CsrfIgnoreRoutesToken } from \\"fusion-plugin-csrf-protection\\";
import fetch from \\"unfetch\\";
import App from \\"fusion-core\\";
export default async function start() {
  const app = new App(\\"test\\", el => el);
  app.enhance(FetchToken, CsrfProtectionPlugin);
  app.register(FetchToken, unfetch);
  __NODE__ && app.register(CsrfIgnoreRoutesToken, [\\"/_errors\\"]);
  if (__BROWSER__) {}
  return app;
}"
`);
  await remove(fixture);
});

test('csrf protection codemod withServices', async () => {
  const contents = `
import React from 'react';
import {withFetch} from "fusion-plugin-csrf-protection-react";

export default withFetch(function start() {
  return (<div>Hello</div>);
})`;
  const fixture = 'fixtures/csrf-enhancer/fixture.js';
  await writeFile(fixture, contents);
  await codemod.step();
  const newContents = (await readFile(fixture)).toString();
  // $FlowFixMe
  expect(newContents).toMatchInlineSnapshot(`
"
import React from 'react';
import {withServices} from 'fusion-react';
import {FetchToken} from 'fusion-tokens';

export default withServices({fetch: FetchToken})(function start() {
  return (<div>Hello</div>);
})"
`);
  await remove(fixture);
});
