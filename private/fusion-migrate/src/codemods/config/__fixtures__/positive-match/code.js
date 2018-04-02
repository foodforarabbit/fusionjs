/* Fetch the IDL files when you add new services t.uber.com/idl */

export default {
  // Enumerate what backend services you are communicating with.
  // Find services at https://infra.uberinternal.com/apps/
  // Fetch the IDL files when you add new services via [idl command](t.uber.com/idl)
  serviceNames: ['populous'], // list of downstream service names
};
