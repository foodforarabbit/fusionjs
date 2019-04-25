// @flow
process.on('unhandledRejection', e => {
  throw e;
});
