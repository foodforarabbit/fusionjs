// @flow
import {migrateCsrfProtectionToV2} from './enhancer.js';
import {writeFile, readFile, removeFile} from '@dubstep/core';

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
  const root = 'fixtures/csrf-enhancer-registration';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await migrateCsrfProtectionToV2({dir: root, edge: false});
  const newContents = await readFile(fixture);
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
  await removeFile(root);
});

test('csrf protection codemod withServices', async () => {
  const contents = `
import React from 'react';
import {withFetch} from "fusion-plugin-csrf-protection-react";

export default withFetch(function start() {
  return (<div>Hello</div>);
})`;
  const root = 'fixtures/csrf-enhancer-hoc';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await migrateCsrfProtectionToV2({dir: root, edge: false});
  const newContents = await readFile(fixture);
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
  await removeFile(root);
});
