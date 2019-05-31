// @flow
/* eslint-env node */
import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import tape from 'tape-cup';
import {LoggerToken} from 'fusion-tokens';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {HeatpipeToken} from '../tokens';
import HeatpipePlugin from '../server';

const {test} = tape;

test('heatpipe-plugin no-op in __DEV__ mode', async t => {
  const events = {
    on(type) {
      t.equal(type, `heatpipe:publish`, 'adds event handler correctly');
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
            t.equal(resp, undefined, 'resolves with undefined in __DEV__ mode');
            t.end();
          });
      },
    })
  );
  getSimulator(app);
});
