// @flow

/* global global */

import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {FetchToken} from 'fusion-tokens';

import {UberMarketingBrowserToken} from '../src/tokens';
import Plugin from '../src/MarketingBrowserPlugin/browser';

let windowSpy;

beforeEach(() => {
  windowSpy = jest.spyOn(global, 'window', 'get');
});

afterEach(() => {
  windowSpy.mockRestore();
});

test('test', () => {
  expect(typeof window).toEqual('object');
});

const fetchMock = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    json: () => {
      return {
        session_id: 'mock_session_id',
        cookie_id: 'mock_cookie_id',
      };
    },
  });
});

function createMockApp({testPlugin}: {testPlugin?: Object}) {
  const app = new App({}, () => 'ok');
  // $FlowFixMe
  app.register(testPlugin);
  // $FlowFixMe
  app.register(FetchToken, fetchMock);
  app.register(UberMarketingBrowserToken, Plugin);

  const simulator = getSimulator(app);
  return simulator;
}

test('should POST to /_track with query string and referrer', async done => {
  const mockPath =
    '/app?utm_source=foo&utm_campaign=bar&utm_campaign=not-picked';
  const testPlugin = createPlugin({
    deps: {
      Marketing: UberMarketingBrowserToken,
    },
    middleware({Marketing}) {
      return async (ctx, next) => {
        const marketing = Marketing.from(ctx);
        const res = await marketing.getTrackResponse();
        setTimeout(() => {
          expect(fetchMock).toHaveBeenCalled();
          expect(fetchMock.mock.calls[0]).toMatchSnapshot(
            'fetch request params'
          );
          expect(res).toMatchSnapshot('fetch response');
          done();
        }, 100);
      };
    },
  });

  const location = {
    href: `https://www.uber.com${mockPath}`,
  };

  const document = {
    location,
    referrer: 'https://www.uber.com/referrer',
  };

  const window = {
    location,
    document,
  };
  windowSpy.mockImplementation(() => window);
  const simulator = createMockApp({testPlugin});
  await simulator.render(mockPath);
});
