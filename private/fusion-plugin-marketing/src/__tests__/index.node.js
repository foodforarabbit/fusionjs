// @flow
/* global global */
import isUUID from 'validator/lib/isUUID';
import http from 'http';

import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
import {LoggerToken} from 'fusion-tokens';

import {UberMarketingToken, UberMarketingConfigToken} from '../tokens';
import Plugin from '../server';

const mockUA = {
  desktop:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.189 Safari/537.36 Viv/1.95.1077.60',
  mobile:
    'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36',
  bot: 'AdsBot-Google (+http://www.google.com/adsbot.html)',
};

const realDate = global.Date;
beforeAll(() => {
  global.Date = function() {
    return {
      valueOf: () => 1536789961819,
      toUTCString: () => 'Thu, 12 Sep 2019 21:15:05 GMT',
    };
  };
  global.Date.now = jest.fn(() => 1536789961819);
});

afterAll(() => {
  global.Date = realDate;
});

function createMockApp({
  testPlugin,
  config,
}: {
  testPlugin?: Object,
  config?: Object,
}) {
  const heatpipeMock = {publish: jest.fn()};
  const loggerMock = {info: jest.fn()};

  const app = new App({}, () => 'ok');
  // $FlowFixMe
  app.register(testPlugin);
  // $FlowFixMe
  app.register(HeatpipeToken, heatpipeMock);
  // $FlowFixMe
  app.register(LoggerToken, loggerMock);
  app.register(UberMarketingToken, Plugin);
  app.register(
    UberMarketingConfigToken,
    config || {
      cookieAge: 31536000,
      cookieIdKey: 'marketing_vistor_id',
      cookieDomain: '.uber.com',
      serverDomain: 'www.uber.com',
      disableHeatpipe: false,
      debugLogging: false,
    }
  );

  const simulator = getSimulator(app);
  return simulator;
}

function testStringInOutgoingCookies(ctx, str) {
  // $FlowFixMe
  const _OutgoingCookies = http.OutgoingMessage.prototype.getHeaders.apply(
    ctx.res
  )['set-cookie'];
  expect(_OutgoingCookies).toEqual([expect.stringContaining(str)]);
}

test('Config overrides', async () => {
  const mockConfig = {
    cookieAge: 123,
    cookieIdKey: 'foo',
    cookieDomain: '.example.com',
    serverDomain: 'bar.example.com', // TODO: consolidate this to a single meta field
    disableHeatpipe: true,
  };

  const testPlugin = createPlugin({
    deps: {Marketing: UberMarketingToken},
    middleware({Marketing}) {
      return async (ctx, next) => {
        const marketing = Marketing.from(ctx);
        expect(marketing.config).toEqual(mockConfig);
      };
    },
  });

  createMockApp({testPlugin, config: mockConfig});
});

test('Generating cookieId', async () => {
  const testPlugin = createPlugin({
    deps: {Marketing: UberMarketingToken},
    middleware({Marketing}) {
      return async (ctx, next) => {
        await next();
        const marketing = Marketing.from(ctx);
        expect(isUUID(marketing.getCookieId())).toBe(true);
        testStringInOutgoingCookies(ctx, marketing.getCookieId());
      };
    },
  });

  const simulator = createMockApp({testPlugin});
  simulator.render('/app');
});

test('Getting cookieId from request', async () => {
  const mockUuid = '7f51756d-053d-43e3-9de3-1b103fffc625';

  const testPlugin = createPlugin({
    deps: {Marketing: UberMarketingToken},
    middleware({Marketing}) {
      return async (ctx, next) => {
        await next();
        const marketing = Marketing.from(ctx);
        expect(marketing.getCookieId()).toBe(mockUuid);
        testStringInOutgoingCookies(ctx, mockUuid);
      };
    },
  });

  const simulator = createMockApp({testPlugin});
  simulator.render('/app', {
    headers: {
      cookie: `marketing_vistor_id=${mockUuid}`,
    },
  });
});

function BasicPublishTest(
  done,
  {requestUrl, userAgent}: {requestUrl?: string, userAgent?: string}
) {
  const mockUuid = '7f51756d-053d-43e3-9de3-1b103fffc625';
  const testPlugin = createPlugin({
    deps: {
      Marketing: UberMarketingToken,
      heatpipeMock: HeatpipeToken,
      loggerMock: LoggerToken,
    },
    middleware({Marketing, heatpipeMock, loggerMock}) {
      return async (ctx, next) => {
        await next();
        setTimeout(() => {
          expect((heatpipeMock.publish: any).mock.calls[0]).toMatchSnapshot();
          expect(loggerMock.info).not.toHaveBeenCalled();
          done();
        }, 100);
      };
    },
  });

  const simulator = createMockApp({testPlugin});
  simulator.render(
    requestUrl ||
      '/app?utm_source=foo&utm_campaign=bar&utm_campaign=not-picked',
    {
      headers: {
        cookie: `marketing_vistor_id=${mockUuid}`,
        'user-agent': userAgent || mockUA.desktop,
        referer: 'https://awesome.com/',
      },
    }
  );
}

test('Basic publish(UA desktop)', async done => {
  BasicPublishTest(done, {userAgent: mockUA.desktop});
});

test('User Agent - isMobile', async done => {
  BasicPublishTest(done, {userAgent: mockUA.mobile});
});

test('User Agent - isBot(should skip)', async done => {
  BasicPublishTest(done, {userAgent: mockUA.bot});
});

test('should skip - /health', async done => {
  BasicPublishTest(done, {requestUrl: '/health'});
});

test('should skip - assets', async done => {
  BasicPublishTest(done, {requestUrl: '/_static/foo.aaa'});
});

test('log when debugLogging is enabled', async done => {
  const mockUuid = '7f51756d-053d-43e3-9de3-1b103fffc625';
  const mockConfig = {
    debugLogging: true,
  };
  const testPlugin = createPlugin({
    deps: {
      Marketing: UberMarketingToken,
      heatpipeMock: HeatpipeToken,
      loggerMock: LoggerToken,
    },
    middleware({Marketing, heatpipeMock, loggerMock}) {
      return async (ctx, next) => {
        await next();
        setTimeout(() => {
          expect((heatpipeMock.publish: any).mock.calls[0]).toMatchSnapshot();
          expect(loggerMock.info).toHaveBeenCalled();
          done();
        }, 100);
      };
    },
  });

  const simulator = createMockApp({testPlugin, config: mockConfig});
  simulator.render(
    '/app?utm_source=foo&utm_campaign=bar&utm_campaign=not-picked',
    {
      headers: {
        cookie: `marketing_vistor_id=${mockUuid}`,
        'user-agent': mockUA.desktop,
        referer: 'https://awesome.com/',
      },
    }
  );
});
