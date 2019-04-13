// @noflow
import {FetchToken} from 'fusion-tokens';
import {createPlugin} from 'fusion-core';
import getXhr from './uber-xhr.js';

// wrapped in a function here for easier testing
export default () => {
  const xhr = getXhr();
  const plugin = createPlugin({
    deps: {
      fetch: FetchToken,
    },
    provides: ({fetch}) => {
      xhr.setFetch(fetch);
    },
  });
  return {xhr, plugin};
};
