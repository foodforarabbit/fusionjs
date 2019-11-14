// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {installFeatureToggles} from './installation.js';

import isFile from '../utils/is-file.js';

jest.mock('../../utils/get-latest-version.js', () => ({
  getLatestVersion: () => Promise.resolve('^1.0.0'),
}));

test('sanity - fusion flags codemod', async () => {
  const contents = `
    import App from 'fusion-core';
    export default async function start() {
      const app = new App('test', el => el);
      return app;
    }`;
  const root = 'fixtures/fusion-flags-sanity';
  const mainFixture = `${root}/src/main.js`;
  const configFixture = `${root}/src/config/toggles.js`;
  await writeFile(`${root}/package.json`, '{"name": "foo"}');
  await writeFile(mainFixture, contents);
  await installFeatureToggles({dir: root, strategy: 'latest'});
  expect(await readFile(mainFixture)).toMatchInlineSnapshot(`
                        "
                            import App from 'fusion-core';
                            import FeatureTogglesPlugin, {
                                    FeatureTogglesTogglesConfigToken
                                  } from '@uber/fusion-plugin-feature-toggles-react';
                            import featureTogglesConfig from './config/toggles.js';
                            export default async function start() {
                              const app = new App('test', el => el);
                              app.register(FeatureTogglesPlugin);
                              __NODE__ && app.register(FeatureTogglesTogglesConfigToken, featureTogglesConfig);
                              return app;
                            }"
            `);
  expect(await readFile(configFixture)).toMatchInlineSnapshot(`
    "
                // @flow
                export default [
                  /*feature toggle details*/
                ];
              "
  `);
  await removeFile(root);
});

test('fusion flags codemod with uber/ directory', async () => {
  const contents = `
    import App from 'fusion-core';
    export default async function start() {
      const app = new App('test', el => el);
      return app;
    }`;
  const root = 'fixtures/fusion-flags-sanity';
  const mainFixture = `${root}/src/main.js`;
  const configFixture = `${root}/src/config/toggles.js`;
  const uberFixture = `${root}/src/uber/test.js`;
  const xpFixture = `${root}/src/uber/xp.js`;
  await writeFile(`${root}/package.json`, '{"name": "foo"}');
  await writeFile(mainFixture, contents);
  await writeFile(uberFixture, '');
  await installFeatureToggles({dir: root, strategy: 'latest'});
  expect(await readFile(xpFixture)).toMatchInlineSnapshot(`
    "
    import FeatureTogglesPlugin, {
      FeatureTogglesTogglesConfigToken
    } from '@uber/fusion-plugin-feature-toggles-react';
    import type FusionApp from 'fusion-core';
    import featureTogglesConfig from '../config/toggles.js';

    export default function initXP(app: FusionApp) { 
      app.register(FeatureTogglesPlugin);
      if (__NODE__) {
        app.register(FeatureTogglesTogglesConfigToken, featureTogglesConfig); 
      }
    }
    "
  `);
  expect(await readFile(mainFixture)).toMatchInlineSnapshot(`
    "
        import App from 'fusion-core';
        import initXP from '../uber/xp.js';
        export default async function start() {
          const app = new App('test', el => el);
          initXP(app);
          return app;
        }"
  `);
  expect(await readFile(configFixture)).toMatchInlineSnapshot(`
    "// @flow
    export default [
      /*feature toggle details*/
    ];"
  `);
  await removeFile(root);
});

test('fusion flags codemod w/ full registration already present', async () => {
  const mainContents = `
    import App from 'fusion-core';
    import FeatureTogglesPlugin, {
      FeatureTogglesTogglesConfigToken
    } from '@uber/fusion-plugin-feature-toggles-react';
    import featureTogglesConfig from './config/toggles.js';

    export default async function start() {
      const app = new App('test', el => el);
      app.register(FeatureTogglesPlugin);
      if(__NODE__) {
        app.register(FeatureTogglesTogglesConfigToken, featureTogglesConfig);
      }
      return app;
    }`;
  const configContents = `
    // @flow
    export default ['some-toggle-name'];
  `;
  const root = 'fixtures/fusion-flags-registration-present';
  const mainFixture = `${root}/src/main.js`;
  const configFixture = `${root}/src/config/toggles.js`;
  await writeFile(`${root}/package.json`, '{"name": "foo"}');
  await writeFile(mainFixture, mainContents);
  await writeFile(configFixture, configContents);
  await installFeatureToggles({dir: root, strategy: 'latest'});
  expect(await readFile(mainFixture)).toBe(mainContents);
  expect(await readFile(configFixture)).toBe(configContents);
  await removeFile(root);
});

test('fusion flags codemod w/ partial registration present', async () => {
  const mainContents = `
    import App from 'fusion-core';
    import FeatureTogglesPlugin from '@uber/fusion-plugin-feature-toggles-react';

    export default async function start() {
      const app = new App('test', el => el);
      app.register(FeatureTogglesPlugin);
      return app;
    }`;
  const root = 'fixtures/fusion-flags-partial-registration-present';
  const mainFixture = `${root}/src/main.js`;
  const configFixture = `${root}/src/config/toggles.js`;
  await writeFile(`${root}/package.json`, '{"name": "foo"}');
  await writeFile(mainFixture, mainContents);
  await installFeatureToggles({dir: root, strategy: 'latest'});
  expect(await readFile(mainFixture)).toMatchInlineSnapshot(`
        "
            import App from 'fusion-core';
            import FeatureTogglesPlugin, { FeatureTogglesTogglesConfigToken } from '@uber/fusion-plugin-feature-toggles-react';

            import featureTogglesConfig from './config/toggles.js';

            export default async function start() {
              const app = new App('test', el => el);
              app.register(FeatureTogglesPlugin);
              __NODE__ && app.register(FeatureTogglesTogglesConfigToken, featureTogglesConfig);
              return app;
            }"
    `);
  expect(await readFile(configFixture)).toMatchInlineSnapshot(`
            "
                        // @flow
                        export default [
                          /*feature toggle details*/
                        ];
                      "
      `);
  await removeFile(root);
});

test('fusion flags codemod w/ inline config registration present', async () => {
  const mainContents = `
    import App from 'fusion-core';
    import FeatureTogglesPlugin, {
      FeatureTogglesTogglesConfigToken
    } from '@uber/fusion-plugin-feature-toggles-react';

    export default async function start() {
      const app = new App('test', el => el);
      app.register(FeatureTogglesPlugin);
      __NODE__ && app.register(FeatureTogglesTogglesConfigToken, []);
      return app;
    }`;
  const root = 'fixtures/fusion-flags-inline-registration-present';
  const mainFixture = `${root}/src/main.js`;
  await writeFile(`${root}/package.json`, '{"name": "foo"}');
  await writeFile(mainFixture, mainContents);
  await installFeatureToggles({dir: root, strategy: 'latest'});
  expect(await readFile(mainFixture)).toMatchInlineSnapshot(`
                "
                    import App from 'fusion-core';
                    import FeatureTogglesPlugin, {
                      FeatureTogglesTogglesConfigToken
                    } from '@uber/fusion-plugin-feature-toggles-react';

                    export default async function start() {
                      const app = new App('test', el => el);
                      app.register(FeatureTogglesPlugin);
                      __NODE__ && app.register(FeatureTogglesTogglesConfigToken, []);
                      return app;
                    }"
        `);
  // Verify no config file was created
  const configFixture = `${root}/src/config/toggles.js`;
  expect(await isFile(configFixture)).toBe(false);
  await removeFile(root);
});

test('fusion flags codemod w/ malformed main.js', async () => {
  const contents = `/* there is nothing here */`;
  const root = 'fixtures/fusion-flags-malformed-main';
  const fixture = `${root}/src/main.js`;
  await writeFile(`${root}/package.json`, '{"name": "foo"}');
  await writeFile(fixture, contents);

  await expect(installFeatureToggles({dir: root, strategy: 'latest'}));
  expect(await readFile(fixture)).toEqual(contents);
  await removeFile(root);
});
