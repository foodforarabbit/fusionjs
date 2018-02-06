// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';
import Heatpipe, {webTopicInfo} from '../emitters/heatpipe';

tape('heatpipe emitter interface', t => {
  t.equal(typeof Heatpipe, 'function', 'exports a function');
  class Events extends EventEmitter {
    from() {
      return this;
    }
    emit() {}
  }
  // $FlowFixMe
  const hp = Heatpipe({events: new Events(), service: 'test'});
  t.equal(typeof hp.publish, 'function', 'exposes an publish function');
  t.equal(
    typeof hp.publishWebEvents,
    'function',
    'exposes an publishWebEvents function'
  );
  t.end();
});

tape('heatpipe emitter publish', t => {
  const fixturePayload = {
    topicInfo: {topic: 'awesome-topic', version: 33},
    message: {foo: 1},
  };

  class Events extends EventEmitter {
    from() {
      return this;
    }
    emit(type, payload) {
      t.equal(
        type,
        'heatpipe:publish',
        'emits publish event with correct type'
      );
      t.deepEqual(payload, fixturePayload, 'publish passes payload through');
      t.end();
    }
  }
  const hp = Heatpipe({
    events: new Events(),
    serviceName: 'test',
    AnalyticsSession: {
      from() {},
    },
  });
  hp.publish(fixturePayload);
});

const webEventsFixture = {
  serviceName: 'dev-service',
  eventMessage: {
    type: 'stat',
    name: 'need_for_speed',
    value_number: 1234,
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
    headers: {
      'x-auth-params-user-uuid': '6cd132f9-3842-455f-b50f-9705f317df26',
    },
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
  I18n: {
    _localeString: 'zh-TW',
    from: () => ({
      locale: {
        toString: () => webEventsFixture.I18n._localeString,
      },
    }),
  },
  Geolocation: {
    _geoObject: {
      latitude: 23.6978,
      longitude: 120.9605,
    },
    from: () => ({
      lookup: () => webEventsFixture.Geolocation._geoObject,
    }),
  },
  getResult: () => ({
    type: webEventsFixture.eventMessage.type,
    name: webEventsFixture.eventMessage.name,
    value_number: webEventsFixture.eventMessage.value_number,
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
    user_id: webEventsFixture.ctx.headers['x-auth-params-user-uuid'],
    session_id: webEventsFixture.AnalyticsSession._ua.session_id,
    session_time_ms: webEventsFixture.AnalyticsSession._ua.session_time_ms,
    latitude: webEventsFixture.Geolocation._geoObject.latitude,
    longitude: webEventsFixture.Geolocation._geoObject.longitude,
  }),
};

tape('heatpipe emitter publishWebEvents with dependencies', t => {
  class Events extends EventEmitter {
    from() {
      return this;
    }
    emit(type, payload) {
      t.equal(
        type,
        'heatpipe:publish',
        'emits publish event with correct type'
      );
      t.deepEqual(
        payload.topicInfo,
        webTopicInfo,
        'publishWebEvents sets correct topic information'
      );
      t.deepEqual(
        payload.message,
        {
          ...webEventsFixture.getResult(),
          time_ms: payload.message.time_ms, // no test on Date.now()
        },
        'publishWebEvents message transformed correctly'
      );
      t.end();
    }
  }
  const hp = Heatpipe({
    events: new Events(),
    AnalyticsSession: webEventsFixture.AnalyticsSession,
    I18n: webEventsFixture.I18n,
    Geolocation: webEventsFixture.Geolocation,
    serviceName: webEventsFixture.serviceName,
  });
  hp.publishWebEvents({
    message: webEventsFixture.eventMessage,
    ctx: webEventsFixture.ctx,
    webEventsMeta: webEventsFixture.webEventsMeta,
  });
});

tape('heatpipe emitter publishWebEvents with no useragent', t => {
  class Events extends EventEmitter {
    from() {
      return this;
    }
    emit(type, payload) {
      t.equal(
        type,
        'heatpipe:publish',
        'emits publish event with correct type'
      );
      t.deepEqual(
        payload.topicInfo,
        webTopicInfo,
        'publishWebEvents sets correct topic information'
      );

      const expectedResult = {
        ...webEventsFixture.getResult(),
        time_ms: payload.message.time_ms, // no test on Date.now()
      };
      Object.keys(expectedResult.browser).forEach(key => {
        if (key !== 'locale') {
          expectedResult.browser[key] = undefined;
        }
      });
      t.deepEqual(
        payload.message,
        expectedResult,
        'publishWebEvents message transformed correctly'
      );
      t.end();
    }
  }
  const hp = Heatpipe({
    events: new Events(),
    AnalyticsSession: webEventsFixture.AnalyticsSession,
    I18n: webEventsFixture.I18n,
    Geolocation: webEventsFixture.Geolocation,
    serviceName: webEventsFixture.serviceName,
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

tape('heatpipe emitter publishWebEvents missing dependencies', t => {
  class Events extends EventEmitter {
    from() {
      return this;
    }
    emit(type, payload) {
      t.equal(
        type,
        'heatpipe:publish',
        'emits publish event with correct type'
      );
      t.deepEqual(
        payload.message,
        webEventsFixture.eventMessage,
        'publish passes payload through and no transforms'
      );
      t.end();
    }
  }
  // $FlowFixMe
  const hp = Heatpipe({events: new Events(), service: 'test'});
  hp.publishWebEvents({
    message: webEventsFixture.eventMessage,
  });
});
