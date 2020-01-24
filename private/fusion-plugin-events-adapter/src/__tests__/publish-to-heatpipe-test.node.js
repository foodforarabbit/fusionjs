// @flow
import publishToHeatpipe from '../utils/publish-to-heatpipe.js';

const goodData = {pass: true};
const badData = {fail: true};

test('good data publishes', done => {
  expect.assertions(1);
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
    expect(data).toEqual({pass: true});
    done();
    return Promise.resolve();
  }
});

test('bad data does not publish or throw an exception', done => {
  expect.assertions(1);
  expect(() =>
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
  ).not.toThrow();

  function mockPublish(name, details, data) {
    // $FlowFixMe
    done.fail('should not publish because data is badly formed');
    return Promise.resolve();
  }
  done();
});

test('null data does not publish or throw an excpetion', done => {
  expect.assertions(1);
  expect(() =>
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
  ).not.toThrow();

  function mockPublish(name, details, data) {
    // $FlowFixMe
    done.fail('should not publish because no data');
    return Promise.resolve();
  }
  done();
});

function mockHeatpipeAdapter(data) {
  if (data.fail) {
    throw new Error('bad data');
  }
  return data;
}
