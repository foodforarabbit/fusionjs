// @flow
/* eslint-env node */
import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {HeatpipeToken, HeatpipeConfigToken} from '../src/tokens';
import HeatpipePlugin from '../src/server';

import type {
  TopicInfoType,
  MessageType,
  PublishResponse,
} from '../src/types';

test('heatpipe-plugin no-op in __DEV__ mode', async done => {
  const events = {
    on(type) {
      expect(type).toBe(`heatpipe:publish`);
    },
  };
  const app = new App('content', el => el);
  app.register(HeatpipeToken, HeatpipePlugin);
  // $FlowFixMe
  app.register(LoggerToken, {});
  // $FlowFixMe
  app.register(UniversalEventsToken, events);
  app.register(
    createPlugin({
      deps: {
        heatpipe: HeatpipeToken,
      },
      provides: ({heatpipe}) => {
        heatpipe
          .asyncPublish({topic: 'foo', version: 1}, {hello: 'world'})
          .then(resp => {
            expect(resp).toBe(undefined);
            done();
          });
      },
    })
  );
  getSimulator(app);
});

test('universal event "on" excluded based on config', async done => {
  const events = {
    on: jest.fn(),
  };
  const app = new App('content', el => el);
  app.register(HeatpipeConfigToken, {ignoreUniversalEvents: true});
  app.register(HeatpipeToken, HeatpipePlugin);
  // $FlowFixMe
  app.register(LoggerToken, {});
  // $FlowFixMe
  app.register(UniversalEventsToken, events);
  app.register(
    createPlugin({
      deps: {
        heatpipe: HeatpipeToken,
      },
      provides: ({heatpipe}) => {
        heatpipe
          .asyncPublish({topic: 'foo', version: 1}, {hello: 'world'})
          .then(resp => {
            expect(resp).toBe(undefined);
            done();
          });
      },
    })
  );
  getSimulator(app);
  expect(events.on).not.toHaveBeenCalled();
});

jest.mock('@uber/heatpipe');
const heatpipePublish: JestMockFn<[string, TopicInfoType, MessageType], Promise<PublishResponse | void>> = require('@uber/heatpipe');

const mockHeatpipePublishResponse = resp => {
  const oldDEV = __DEV__;
  __DEV__ = false; // heatpipePublish() is not called for __DEV__ = true
  heatpipePublish.mockReset();
  heatpipePublish.mockImplementation(async () => {
    return Promise.resolve(resp);
  });
  return () => { // To be called after test case is finished to reset __DEV__
    __DEV__ = oldDEV;
  };
};

test('heatpipe-plugin test publish', async done => {
  const app = new App('content', el => el);
  app.register(HeatpipeToken, HeatpipePlugin);
  // $FlowFixMe
  app.register(LoggerToken, {});
  // $FlowFixMe
  const events = {
    on: jest.fn()
  };
  app.register(UniversalEventsToken, events);
  app.register(
    createPlugin({
      deps: {
        heatpipe: HeatpipeToken
      },
      provides: ({ heatpipe }) => {
        const cleanup = mockHeatpipePublishResponse({
          code: 'CODE_SUCCESS',
          msg: 'publish successful'
        });
        heatpipe
          .asyncPublish({topic: 'foo', version: 1}, {hello: 'world'})
          .then(resp => {
            expect(heatpipePublish).toHaveBeenCalledTimes(1);
            expect(heatpipePublish.mock.calls[0]).toMatchInlineSnapshot(`
              Array [
                "dev-service",
                Object {
                  "topic": "foo",
                  "version": 1,
                },
                Object {
                  "hello": "world",
                },
              ]
            `);
            expect(resp).toMatchInlineSnapshot(`
              Object {
                "code": "CODE_SUCCESS",
                "msg": "publish successful",
              }
            `);
            done();
          });
        cleanup();
      }
    })
  );
  getSimulator(app);
});

test('heatpipe-plugin test lossless publish', async done => {
  const app = new App('content', el => el);
  app.register(HeatpipeToken, HeatpipePlugin);
  // $FlowFixMe
  app.register(LoggerToken, {});
  // $FlowFixMe
  const events = {
    on: jest.fn()
  };
  app.register(UniversalEventsToken, events);
  app.register(
    createPlugin({
      deps: {
        heatpipe: HeatpipeToken
      },
      provides: ({ heatpipe }) => {
        const cleanup = mockHeatpipePublishResponse({
          code: 'CODE_SUCCESS',
          msg: 'publish successful'
        });
        heatpipe
          .asyncPublish({topic: 'foo', version: 1, lossless: true}, {hello: 'world'})
          .then(resp => {
            expect(heatpipePublish).toHaveBeenCalledTimes(1);
            expect(heatpipePublish.mock.calls[0]).toMatchInlineSnapshot(`
              Array [
                "dev-service",
                Object {
                  "lossless": true,
                  "topic": "foo",
                  "version": 1,
                },
                Object {
                  "hello": "world",
                },
              ]
            `);
            expect(resp).toMatchInlineSnapshot(`
              Object {
                "code": "CODE_SUCCESS",
                "msg": "publish successful",
              }
            `);
            done();
          });
        cleanup();
      }
    })
  );
  getSimulator(app);
});
