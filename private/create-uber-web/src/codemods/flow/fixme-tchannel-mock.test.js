// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {fixMeTchannelMock} from './fixme-tchannel-mock.js';

test('fixMeTchannelMock', async () => {
  const root = 'fixtures/fixme-tchannel-mock';
  const file = `${root}/src/test-utils/test-app.js`;
  await writeFile(
    file,
    `
export default async function start() {
  const app = await getApp();

  if (__NODE__) {
    app.register(GalileoConfigToken, {
      enabled: false,
    });
    app.register(TChannelToken, {});
  }
}`
  );
  await fixMeTchannelMock({dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('// $FlowFixMe')).toBe(true);
});

test('fixMeTchannelMock dedupe', async () => {
  const root = 'fixtures/fixme-tchannel-mock-dedupe';
  const file = `${root}/src/test-utils/test-app.js`;
  await writeFile(
    file,
    `
export default async function start() {
  const app = await getApp();

  if (__NODE__) {
    app.register(GalileoConfigToken, {
      enabled: false,
    });
    // $FlowFixMe
    app.register(TChannelToken, {});
  }
}`
  );
  await fixMeTchannelMock({dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.match(/FlowFixMe/).length).toBe(1);
});