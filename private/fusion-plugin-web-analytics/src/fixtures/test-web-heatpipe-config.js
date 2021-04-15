// @flow
export const testWebHeatpipeConfig = {
  schemes: {
    'web-heatpipe-test-1': {
      custom: {
        _interpolatable: true,
        type: 'ref',
        value: 'window.referrer',
      },
      flag: {
        _interpolatable: true,
        type: 'ref',
        value: 'payload.flag',
      },
      code: {
        _interpolatable: true,
        type: 'ref',
        value: 'payload.code',
      },
      unset: {
        _interpolatable: true,
        type: 'ref',
        value: 'payload.unset',
      },
    },
  },
  events: {
    'main.click': {
      destinations: {
        'web-heatpipe': [{schemes: ['web-heatpipe-test-1'], method: 'track'}],
      },
    },
  },
  destinations: {
    'web-heatpipe': {type: 'web-heatpipe'},
  },
};
