// @flow
import App, {escape} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

import Plugin from '../index.js';
import {UberWebAnalyticsToken, UberWebAnalyticsFliprToken} from '../tokens';

const SERVICE_NAME = 'awesome-service';

const MockFlipr = mockConfig => {
  return {
    get: key => {
      expect(key).toEqual(`${SERVICE_NAME}.0`);
      return mockConfig;
    },
  };
};

describe('[fusion-plugin-web-analytics] Server Plugin', () => {
  // eslint-disable-next-line
  const OLD_ENV = process.env;

  beforeEach(() => {
    // eslint-disable-next-line
    process.env = { ...OLD_ENV };
  });

  test('basics', async () => {
    // eslint-disable-next-line
    process.env.SVC_ID = SERVICE_NAME;

    const mockConfig = {
      events: {},
      schemes: {},
      destinations: {m3: {type: 'm3'}},
    };

    const app = new App('TestEl', el => el);
    app.register(UberWebAnalyticsToken, Plugin);
    app.register(UberWebAnalyticsFliprToken, MockFlipr(mockConfig));
    const sim = getSimulator(app);
    const ctx = await sim.render('/test');
    const expectedSerialized = escape(JSON.stringify(mockConfig));
    expect(ctx.body).toMatch(expectedSerialized);
  });

  test('empty destination type configs', async () => {
    // eslint-disable-next-line
    process.env.SVC_ID = SERVICE_NAME;

    const emptyDestConfig = {
      events: {},
      schemes: {},
      destinations: {
        ga: {type: 'googleAnalytics'},
        tealium: {type: 'tealium'},
        'web-heatpipe': {type: 'web-heatpipe'},
        m3: {type: 'm3'},
      },
    };

    const app = new App('TestEl', el => el);
    app.register(UberWebAnalyticsToken, Plugin);
    app.register(UberWebAnalyticsFliprToken, MockFlipr(emptyDestConfig));
    const sim = getSimulator(app);
    const ctx = await sim.render('/test');
    const expectedSerialized = escape(JSON.stringify(emptyDestConfig));
    expect(ctx.body).toMatch(expectedSerialized);
  });
});
