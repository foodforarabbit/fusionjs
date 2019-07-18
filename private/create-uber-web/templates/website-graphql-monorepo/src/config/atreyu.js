// @flow
// Find services at https://infra.uberinternal.com/apps/
// Fetch the IDL files when you add new services t.uber.com/idl
export default {
  services: {
    populous: {},
    trident: {},
  },
  links: [
    {
      from: {
        service: 'populous',
        idlService: 'UserService',
      },
      to: {
        service: 'trident',
        idlService: 'TripService',
      },
    },
  ],
};
