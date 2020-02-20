// @flow
/* eslint-env node */
import createStore from '../src/index.js';

test('store', async () => {
  process.env.SVC_ID = 'foo';
  const store = createStore();

  const timeline = [];
  const heatpipe = {
    async asyncPublish(...args) {
      timeline.push(args);
    },
  };

  await store.store(
    // $FlowFixMe
    {
      runtime: {
        nodeVersion: '10.0.0',
        npmVersion: '6.0.0',
        yarnVersion: '1.9.0',
        lockFileType: 'yarn',
        dependencies: {
          a: '0.0.0',
          b: '0.0.1',
        },
      },
    },
    {heatpipe}
  );

  expect(timeline).toEqual([
    [
      {topic: 'hp-unified-logging-fusion-runtime-metadata', version: 2},
      {
        service: 'foo',
        uuid: expect.stringContaining(''),
        gitRef: '',
        nodeVersion: '10.0.0',
        npmVersion: '6.0.0',
        yarnVersion: '1.9.0',
        lockFileType: 'yarn',
      },
    ],
    [
      {
        topic: 'hp-unified-logging-fusion-runtime-dependency-version-usage',
        version: 2,
      },
      {
        service: 'foo',
        uuid: expect.stringContaining(''),
        gitRef: '',
        dependency: 'a',
        version: '0.0.0',
      },
    ],
    [
      {
        topic: 'hp-unified-logging-fusion-runtime-dependency-version-usage',
        version: 2,
      },
      {
        service: 'foo',
        uuid: expect.stringContaining(''),
        gitRef: '',
        dependency: 'b',
        version: '0.0.1',
      },
    ],
  ]);
});

test('storeSync', () => {
  process.env.SVC_ID = 'foo';
  const store = createStore();

  const timeline = [];

  const log = console.log; //eslint-disable-line
  // $FlowFixMe
  console.log = (...args) => timeline.push(args); //eslint-disable-line
  // $FlowFixMe don't really care about schema conformance, only that it serializes correctly
  store.storeSync({a: 1});
  expect(timeline).toEqual([['{\n  "a": 1\n}']]);
  // $FlowFixMe
  console.log = log; //eslint-disable-line
});
