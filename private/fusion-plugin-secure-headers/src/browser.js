import {createPlugin} from 'fusion-core';

/* eslint-env browser */
export default createPlugin({
  provides: () => ({
    from() {
      throw new Error('Cannot call SecureHeaders.from() in the browser');
    },
  }),
});
