// @flow
/* Fetch the IDL files when you add new services t.uber.com/idl */

export default {
  // Enumerate what backend services you are communicating with.
  // Find services at https://infra.uberinternal.com/apps/
  // Fetch the IDL files when you add new services via [idl command](t.uber.com/idl)
  services: {
    populous: {
      // service name
      type: 'tchannel', // service type
      config: {
        // service configuration
        as: 'thrift', // idl type
        with: 'hyperbahn',
        serviceWhitelist: ['UserService'], // whitelisted thrift services (needed for code generation)
        // filepath to thrift idl
        thriftSourcePath:
          'idl/code.uber.internal/infra/populous/populous.thrift',
      },
    },
  },
};
