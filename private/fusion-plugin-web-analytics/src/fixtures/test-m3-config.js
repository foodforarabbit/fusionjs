// @flow
export const testM3Config = {
  schemes: {
    'm3-test-1': {
      key: 'm3.test.1',
      tags: {success: true},
    },
  },
  events: {
    CREATE_USER_SUCCESS: {
      destinations: {m3Test: [{schemes: ['m3-test-1'], method: 'increment'}]},
    },
  },
  destinations: {
    m3Test: {type: 'm3'},
  },
};

export const testM3NestedConfig = {
  schemes: {
    'm3-test-2': {
      key: 'm3.test.2',
      tags: {
        custom: {
          _interpolatable: true,
          type: 'ref',
          value: 'payload.data',
        },
      },
    },
  },
  events: {
    CREATE_USER_SUCCESS: {
      destinations: {m3Test: [{schemes: ['m3-test-2'], method: 'increment'}]},
    },
  },
  destinations: {
    m3Test: {type: 'm3'},
  },
};
