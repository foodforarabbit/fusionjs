// @flow
// Find services at https://infra.uberinternal.com/apps/
// Fetch the IDL files when you add new services t.uber.com/idl
export default {
  services: {
    populous: {
      type: 'tchannel',
      config: {
        as: 'thrift',
        with: 'hyperbahn',
        serviceWhitelist: ['UserService'],
        // test
        thriftSourcePath:
          'idl/code.uber.internal/infra/populous/populous.thrift',
      },
    },
  },
};
