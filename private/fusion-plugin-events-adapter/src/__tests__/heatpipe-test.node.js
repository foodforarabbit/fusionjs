// @noflow
import EventEmitter from './custom-event-emitter.js';
import HeatpipeEmitter, {webTopicInfo} from '../emitters/heatpipe-emitter';
import AuthHeadersPlugin from '@uber/fusion-plugin-auth-headers';

test('heatpipe emitter interface', () => {
  expect(typeof HeatpipeEmitter).toBe('function');
  class Events extends EventEmitter {
    from() {
      return this;
    }
    emit() {}
  }
  // $FlowFixMe
  const hp = HeatpipeEmitter({events: new Events(), service: 'test'});
  expect(typeof hp.publish).toBe('function');
  expect(typeof hp.publishWebEvents).toBe('function');
});

test('heatpipe emitter publish', done => {
  const fixturePayload = {
    topicInfo: {topic: 'awesome-topic', version: 33},
    message: {foo: 1},
  };

  const mockHeatpipe = {
    asyncPublish(topicInfo, message) {
      expect({topicInfo, message}).toEqual(fixturePayload);
      done();
      return Promise.resolve();
    },
  };

  const hp = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    serviceName: 'test',
    AnalyticsSession: {
      from() {},
    },
  });
  hp.publish(fixturePayload);
});

test('heatpipe emitter error handling', done => {
  const fixturePayload = {
    topicInfo: {topic: 'awesome-topic', version: 33},
    message: {foo: 1},
  };

  const mockLogger = {
    error: msg => {
      expect(msg).toBeTruthy();
      done();
    },
  };

  const mockHeatpipe = {
    asyncPublish(topicInfo, message) {
      return Promise.reject();
    },
  };

  const hp = HeatpipeEmitter({
    logger: mockLogger,
    heatpipe: mockHeatpipe,
    serviceName: 'test',
    AnalyticsSession: {
      from() {},
    },
  });
  hp.publish(fixturePayload);
  expect('does not throw').toBeTruthy();
});

const webEventsFixture = {
  serviceName: 'dev-service',
  runtime: 'development',
  eventMessage: {
    type: 'stat',
    name: 'need_for_speed',
    value_number: 1234,
    value_map: {
      extra: 'data',
    },
  },
  ctx: {
    useragent: {
      ua:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110',
      browser: {
        name: 'Chrome',
        version: '58.0.3029.110',
      },
      os: {
        name: 'Mac OS',
        version: '10.11.5',
      },
      engine: {
        name: 'WebKit',
        version: '537.36',
      },
    },
    request: {
      headers: {
        'x-auth-params-user-uuid': '6cd132f9-3842-455f-b50f-9705f317df26',
      },
    },
    memoized: new Map(),
  },
  webEventsMeta: {
    dimensions: {
      screen_height: 900,
      screen_width: 900,
      viewport_height: 900,
      viewport_width: 900,
    },
    page: {
      url: 'www.uber.com',
      hostname: 'www.uber.com',
      pathname: '/',
      referrer: '',
    },
  },
  AnalyticsSession: {
    _ua: {
      session_id: '05fec7ce-21c5-4d6f-9a60-e0346e9d68ab',
      session_time_ms: 1509116637127,
    },
    from: () => webEventsFixture.AnalyticsSession._ua,
  },
  AuthHeaders: AuthHeadersPlugin.provides({}),
  I18n: {
    _localeString: 'zh-TW',
    from: () => ({
      locale: {
        toString: () => webEventsFixture.I18n._localeString,
      },
    }),
  },
  getResult: () => ({
    type: webEventsFixture.eventMessage.type,
    name: webEventsFixture.eventMessage.name,
    value_number: webEventsFixture.eventMessage.value_number,
    value_map: {
      extra: webEventsFixture.eventMessage.value_map.extra,
    },
    page: webEventsFixture.webEventsMeta.page,
    dimensions: webEventsFixture.webEventsMeta.dimensions,
    browser: {
      name: webEventsFixture.ctx.useragent.browser.name,
      version: webEventsFixture.ctx.useragent.browser.version,
      engine: webEventsFixture.ctx.useragent.engine.name,
      os: webEventsFixture.ctx.useragent.os.name,
      os_version: webEventsFixture.ctx.useragent.os.version,
      user_agent: webEventsFixture.ctx.useragent.ua,
      locale: webEventsFixture.I18n._localeString,
    },
    app_name: webEventsFixture.serviceName,
    app_runtime: webEventsFixture.runtime,
    user_id: webEventsFixture.ctx.request.headers['x-auth-params-user-uuid'],
    session_id: webEventsFixture.AnalyticsSession._ua.session_id,
    session_time_ms: webEventsFixture.AnalyticsSession._ua.session_time_ms,
  }),
};

test('heatpipe emitter publishWebEvents with dependencies', done => {
  const mockHeatpipe = {
    asyncPublish(topicInfo, message) {
      expect(topicInfo).toEqual(webTopicInfo);
      expect(message).toEqual({
        ...webEventsFixture.getResult(),
        time_ms: message.time_ms, // no test on Date.now()
      });

      done();
      return Promise.resolve();
    },
  };

  const hp = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    AnalyticsSession: webEventsFixture.AnalyticsSession,
    AuthHeaders: webEventsFixture.AuthHeaders,
    I18n: webEventsFixture.I18n,
    serviceName: webEventsFixture.serviceName,
    runtime: webEventsFixture.runtime,
  });
  hp.publishWebEvents({
    message: webEventsFixture.eventMessage,
    ctx: webEventsFixture.ctx,
    webEventsMeta: webEventsFixture.webEventsMeta,
  });
});

test('heatpipe emitter publishWebEvents with no useragent', done => {
  const mockHeatpipe = {
    asyncPublish(topicInfo, message) {
      expect(topicInfo).toEqual(webTopicInfo);

      const expectedResult = {
        ...webEventsFixture.getResult(),
        time_ms: message.time_ms, // no test on Date.now()
      };
      Object.keys(expectedResult.browser).forEach(key => {
        if (key !== 'locale') {
          expectedResult.browser[key] = undefined;
        }
      });
      expect(message).toEqual(expectedResult);
      done();
      return Promise.resolve();
    },
  };

  const hp = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    AnalyticsSession: webEventsFixture.AnalyticsSession,
    AuthHeaders: webEventsFixture.AuthHeaders,
    I18n: webEventsFixture.I18n,
    serviceName: webEventsFixture.serviceName,
    runtime: webEventsFixture.runtime,
  });
  const ctx = {
    ...webEventsFixture.ctx,
    useragent: null,
  };
  hp.publishWebEvents({
    message: webEventsFixture.eventMessage,
    ctx,
    webEventsMeta: webEventsFixture.webEventsMeta,
  });
});

test('heatpipe emitter publishWebEvents missing dependencies', done => {
  const mockHeatpipe = {
    asyncPublish(topicInfo, message) {
      expect(message).toEqual({
        ...webEventsFixture.eventMessage,
        app_name: webEventsFixture.serviceName,
        app_runtime: webEventsFixture.runtime,
      });
      done();
      return Promise.resolve();
    },
  };

  // $FlowFixMe
  const hp = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    serviceName: webEventsFixture.serviceName,
    runtime: webEventsFixture.runtime,
  });
  hp.publishWebEvents({
    message: webEventsFixture.eventMessage,
  });
});
