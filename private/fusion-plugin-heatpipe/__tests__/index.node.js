// @flow
/* eslint-env node */
import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {HeatpipeToken, HeatpipeConfigToken} from '../src/tokens';
import HeatpipePlugin from '../src/server';

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
