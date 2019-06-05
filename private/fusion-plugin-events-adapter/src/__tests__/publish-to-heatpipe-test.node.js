// @flow
import publishToHeatpipe from '../utils/publish-to-heatpipe.js';
import tape from 'tape-cup';

const goodData = {pass: true};
const badData = {fail: true};

tape('good data publishes', t => {
  t.plan(2);
  publishToHeatpipe(
    {enhancedMetrics: goodData, __url__: 'https://abc.com'},
    {request: {}},
    {
      name: 'abc',
      version: '1.0',
      fusion: true,
      publishFn: mockPublish,
      adaptForHeatpipeFn: mockHeatpipeAdapter,
      serverPerfCollectorFn: () => (_, data) => data,
    }
  );

  function mockPublish(name, details, data) {
    t.pass('should publish');
    t.deepEquals(data, {pass: true});
    t.end();
    return Promise.resolve();
  }
});

tape('bad data does not publish or throw an exception', t => {
  t.plan(1);
  t.doesNotThrow(() =>
    publishToHeatpipe(
      {enhancedMetrics: badData, __url__: 'https://abc.com'},
      {request: {}},
      {
        name: 'abc',
        version: '1.0',
        fusion: true,
        publishFn: mockPublish,
        adaptForHeatpipeFn: mockHeatpipeAdapter,
        serverPerfCollectorFn: () => (_, data) => data,
      }
    )
  );
  t.end();

  function mockPublish(name, details, data) {
    t.fail('should not publish because data is badly formed');
    return Promise.resolve();
  }
});

tape('null data does not publish or throw an excpetion', t => {
  t.plan(1);
  t.doesNotThrow(() =>
    publishToHeatpipe(
      {enhancedMetrics: null, __url__: 'https://abc.com'},
      {request: {}},
      {
        name: 'abc',
        version: '1.0',
        fusion: true,
        publishFn: mockPublish,
        adaptForHeatpipeFn: mockHeatpipeAdapter,
        serverPerfCollectorFn: () => (_, data) => data,
      }
    )
  );
  t.end();

  function mockPublish(name, details, data) {
    t.fail('should not publish because no data');
    return Promise.resolve();
  }
});

function mockHeatpipeAdapter(data) {
  if (data.fail) {
    throw new Error('bad data');
  }
  return data;
}
