// @flow
import tape from 'tape-cup';
import getInitialState from '../index.js';

tape('browser export', t => {
  t.equal(getInitialState, null);
  t.end();
});
