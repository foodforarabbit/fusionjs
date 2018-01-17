// @flow
/* eslint-env browser */

export default function() {
  return {
    from() {
      throw new Error('Cannot call AuthHeaders.from in the browser');
    },
  };
}
