// @flow
import tape from 'tape-cup';

import getInitialState from '../index.js';

tape('browser export', (t): void => {
  t.equal(getInitialState, null);
  t.end();
});
