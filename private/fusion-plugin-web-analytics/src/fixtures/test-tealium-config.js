// @flow
export const testTealiumConfig = {
  schemes: {
    's-test1': {
      firstOfferFetched: {
        _interpolatable: true,
        type: 'ref',
        value: 'redux.offers.data.0.description',
      },
      foo: {
        a: 1,
        b: 2,
        c: {c1: 'm', c2: 'n'},
        d: false,
      },
    },
    's-test2': {
      foo: {
        b: 3,
        c: {c2: 'p', c3: 'q'},
        d: true,
      },
    },
  },
  events: {
    GET_OFFERS_SUCCESS: {
      destinations: {
        tealium: [{schemes: ['s-test1', 's-test2'], method: 'track'}],
      },
    },
  },
  destinations: {
    tealium: {type: 'tealium'},
  },
};

export const testTealiumReduxStore = {
  offers: {data: [{description: 'foobar barfoo'}]},
};
