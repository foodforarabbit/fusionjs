// @flow
export const testGAConfig = {
  schemes: {},
  events: {},
  destinations: {
    ga: {
      type: 'googleAnalytics',
      config: {
        appId: 'testAppId',
        trackingId: 'testTrackingId',
      },
    },
  },
};
