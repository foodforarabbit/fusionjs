// @flow
import {inlineReactHocs} from './codemod-inline-react-hocs.js';
import {writeFile, readFile, removeFile} from '@dubstep/core';
import util from 'util';
import fs from 'fs';

const readDir = util.promisify(fs.readdir);

jest.mock('../../utils/get-latest-version.js', () => ({
  getLatestVersion: () => Promise.resolve('^1.0.0'),
}));

test('codemod-inline-react-hocs rewrites to local path', async () => {
  const contents = `
import Plugin, {Token, withGoogleAnalytics} from "@uber/fusion-plugin-google-analytics-react";
app.register(Token, Plugin);
function Component() {}
withGoogleAnalytics(Component);
`;
  const root = 'fixtures/replace-hoc';
  const fixture = `${root}/src/fixture.js`;
  const inlineHoc = `${root}/src/components/hocs/with-google-analytics.js`;
  await writeFile(fixture, contents);
  const pkg = `${root}/package.json`;
  await writeFile(
    pkg,
    '{"dependencies": {"@uber/fusion-plugin-google-analytics-react": "1.0.0"}}'
  );
  await inlineReactHocs({dir: root, strategy: 'curated'});
  const newContents = await readFile(fixture);
  const hocContents = await readFile(inlineHoc);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import Plugin, { Token } from \\"@uber/fusion-plugin-google-analytics-react\\";
    import {withGoogleAnalytics} from \\"./components/hocs/with-google-analytics.js\\";
    app.register(Token, Plugin);
    function Component() {}
    withGoogleAnalytics(Component);
    "
  `);
  expect(hocContents).toMatchInlineSnapshot(`
    "// @flow
    import {withServices} from 'fusion-react';
    import {GoogleAnalyticsToken} from '@uber/fusion-plugin-google-analytics';

    export const withGoogleAnalytics = withServices({
      googleAnalytics: GoogleAnalyticsToken,
    });
    "
  `);
  const newPkgContents = await readFile(pkg);
  expect(newPkgContents).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {
        \\"@uber/fusion-plugin-google-analytics-react\\": \\"1.0.0\\",
        \\"@uber/fusion-plugin-google-analytics\\": \\"^1.0.0\\"
      }
    }"
  `);
  await removeFile(root);
});

test('codemod-inline-react-hocs works for all necessary packages', async () => {
  const contents = `
import Plugin, {Token, withM3} from "@uber/fusion-plugin-m3-react";
import {withLogger} from "@uber/fusion-plugin-logtron-react";
import {withBatchEvents} from "fusion-plugin-universal-events-react";
import {withTealium, type tealiumType} from "@uber/fusion-plugin-tealium-react";
`;
  const root = 'fixtures/replace-all-hocs';
  const fixture = `${root}/src/fixture.js`;
  const hocDir = `${root}/src/components/hocs`;
  await writeFile(fixture, contents);
  const pkg = `${root}/package.json`;
  await writeFile(
    pkg,
    `{"dependencies": {
      "@uber/fusion-plugin-m3-react": "1.0.0",
      "@uber/fusion-plugin-logtron-react": "2.0.0",
      "fusion-plugin-universal-events-react": "3.0.0",
      "@uber/fusion-plugin-tealium-react": "4.0.0"
    }}`
  );
  await inlineReactHocs({dir: root, strategy: 'curated'});
  expect((await readDir(hocDir)).length).toBe(4);
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import Plugin, { Token } from \\"@uber/fusion-plugin-m3-react\\";
    import { type tealiumType } from \\"@uber/fusion-plugin-tealium-react\\";
    import {withM3} from \\"./components/hocs/with-m3.js\\";
    import {withLogger} from \\"./components/hocs/with-logger.js\\";
    import {withBatchEvents} from \\"./components/hocs/with-batch-events.js\\";
    import {withTealium} from \\"./components/hocs/with-tealium.js\\";
    "
  `);
  const newPkgContents = await readFile(pkg);
  expect(newPkgContents).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {
        \\"@uber/fusion-plugin-m3-react\\": \\"1.0.0\\",
        \\"@uber/fusion-plugin-tealium-react\\": \\"4.0.0\\",
        \\"@uber/fusion-plugin-logtron\\": \\"^1.0.0\\",
        \\"@uber/fusion-plugin-m3\\": \\"^1.0.0\\",
        \\"@uber/fusion-plugin-tealium\\": \\"^1.0.0\\",
        \\"fusion-plugin-universal-events\\": \\"^1.0.0\\"
      }
    }"
  `);
  await removeFile(root);
});

test('codemod-inline-react-hocs in deeply nested path', async () => {
  const contents = `
import {withM3} from "@uber/fusion-plugin-m3-react";
`;
  const root = 'fixtures/replace-hoc-with-long-path';
  const fixture = `${root}/src/components/roots/trip-details/details.js`;
  const inlineHoc = `${root}/src/components/hocs/with-m3.js`;
  await writeFile(fixture, contents);
  const pkg = `${root}/package.json`;
  await writeFile(
    pkg,
    '{"dependencies": {"@uber/fusion-plugin-m3-react": "1.0.0"}}'
  );
  await inlineReactHocs({dir: root, strategy: 'curated'});
  const newContents = await readFile(fixture);
  const hocContents = await readFile(inlineHoc);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import {withM3} from \\"../../hocs/with-m3.js\\";
    "
  `);
  expect(hocContents).toMatchInlineSnapshot(`
    "// @flow
    import {withServices} from 'fusion-react';
    import {M3Token} from '@uber/fusion-plugin-m3';

    export const withM3 = withServices({
      m3: M3Token,
    });
    "
  `);
  const newPkgContents = await readFile(pkg);
  expect(newPkgContents).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {
        \\"@uber/fusion-plugin-m3\\": \\"^1.0.0\\"
      }
    }"
  `);
  await removeFile(root);
});
