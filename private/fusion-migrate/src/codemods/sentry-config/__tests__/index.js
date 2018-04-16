const path = require('path');
const pluginTester = require('../../../utils/codemod-test.js');

const fixtureDir = path.join(__dirname, '../__fixtures__');
const plugin = require('../plugin');

pluginTester(
  fixtureDir,
  plugin({
    common: {},
    prod: {
      clients: {
        logtron: {
          sentry: {
            id: 'http://test:test@sentry.local.uber.internal/1234',
          },
        },
      },
    },
  })
);

pluginTester(
  fixtureDir,
  plugin({
    common: {},
    prod: {
      clients: {
        logtron: {
          sentry: {
            id: 'http://test:test@sentry.uberinternal.com/1234',
          },
        },
      },
    },
  })
);

pluginTester(
  fixtureDir,
  plugin({
    common: {
      clients: {
        logtron: {
          sentry: {
            id: 'http://test:test@sentry.uberinternal.com/1234',
          },
        },
      },
    },
    prod: {},
  })
);

pluginTester(
  fixtureDir,
  plugin({
    common: {
      sentry: {
        server: {
          dsn: 'http://test:test@sentry.uberinternal.com/1234',
        },
      },
    },
    prod: {},
  })
);

pluginTester(
  fixtureDir,
  plugin({
    common: {},
    prod: {
      sentry: {
        server: {
          dsn: 'http://test:test@sentry.uberinternal.com/1234',
        },
      },
    },
  })
);
