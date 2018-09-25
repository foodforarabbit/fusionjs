// @flow
export default {
  csp: {
    overrides: __DEV__ ? {scriptSrc: ["'unsafe-eval'"]} : {},
  },
};
