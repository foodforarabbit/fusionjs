// @flow
import {codemodFusionPluginLogtron} from './codemod-fusion-plugin-logtron';
import {writeFile, readFile, removeFile} from '@dubstep/core';

test('codemod-fusion-plugin-logtron removes team token import and registration', async () => {
  const contents = `
import LoggerPlugin, {
  LogtronTeamToken,
  LogtronBackendsToken,
} from '@uber/fusion-plugin-logtron';
app.register(LogtronTeamToken, team);
app.register(LogtronBackendsToken, {sentry: sentryConfig});
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await codemodFusionPluginLogtron({
    dir: root,
  });
  const newContents = await readFile(fixture);
  const data = newContents;
  await removeFile(root);
  expect(data).toMatchInlineSnapshot(`
"
import LoggerPlugin, { LogtronBackendsToken } from '@uber/fusion-plugin-logtron';
app.register(LogtronBackendsToken, {sentry: sentryConfig});
"
`);
});

test('codemod-fusion-plugin-logtron does not modify code when team token import and registration already removed', async () => {
  const contents = `
import LoggerPlugin, {
  LogtronBackendsToken,
} from '@uber/fusion-plugin-logtron';
app.register(LogtronBackendsToken, {sentry: sentryConfig});
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await codemodFusionPluginLogtron({
    dir: root,
  });
  const newContents = await readFile(fixture);
  const data = newContents;
  await removeFile(root);
  expect(data).toMatchInlineSnapshot(`
"
import LoggerPlugin, {
  LogtronBackendsToken,
} from '@uber/fusion-plugin-logtron';
app.register(LogtronBackendsToken, {sentry: sentryConfig});
"
`);
});

test('codemod-fusion-plugin-logtron removes only team token import when registration not present', async () => {
  const contents = `
import LoggerPlugin, {
  LogtronBackendsToken,
  LogtronTeamToken,
} from '@uber/fusion-plugin-logtron';
app.register(LogtronBackendsToken, {sentry: sentryConfig});
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await codemodFusionPluginLogtron({
    dir: root,
  });
  const newContents = await readFile(fixture);
  const data = newContents;
  await removeFile(root);
  expect(data).toMatchInlineSnapshot(`
"
import LoggerPlugin, { LogtronBackendsToken } from '@uber/fusion-plugin-logtron';
app.register(LogtronBackendsToken, {sentry: sentryConfig});
"
`);
});

test('codemod-fusion-plugin-logtron does not remove team token registration when team token import not present', async () => {
  const contents = `
import LoggerPlugin, {LogtronBackendsToken} from '@uber/fusion-plugin-logtron';
app.register(LogtronTeamToken, team);
app.register(LogtronBackendsToken, {sentry: sentryConfig});
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await codemodFusionPluginLogtron({
    dir: root,
  });
  const newContents = await readFile(fixture);
  const data = newContents;
  await removeFile(root);
  expect(data).toMatchInlineSnapshot(`
"
import LoggerPlugin, {LogtronBackendsToken} from '@uber/fusion-plugin-logtron';
app.register(LogtronTeamToken, team);
app.register(LogtronBackendsToken, {sentry: sentryConfig});
"
`);
});

test('codemod-fusion-plugin-logtron preserves additional tokens', async () => {
  const contents = `
import LoggerPlugin, {
  LogtronTeamToken,
  LogtronBackendsToken,
  LogtronConfigToken,
} from '@uber/fusion-plugin-logtron';
app.register(LogtronTeamToken, team);
app.register(LogtronBackendsToken, {sentry: sentryConfig});
app.register(LogtronConfigToken, {minimumLogLevel: string});
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await codemodFusionPluginLogtron({
    dir: root,
  });
  const newContents = await readFile(fixture);
  const data = newContents;
  await removeFile(root);
  expect(data).toMatchInlineSnapshot(`
"
import LoggerPlugin, { LogtronBackendsToken, LogtronConfigToken } from '@uber/fusion-plugin-logtron';
app.register(LogtronBackendsToken, {sentry: sentryConfig});
app.register(LogtronConfigToken, {minimumLogLevel: string});
"
`);
});
