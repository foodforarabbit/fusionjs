// @flow
import tape from 'tape-cup';

import getInitialState from '../index.js';

tape('getInitialState', (t): void => {
  // $FlowFixMe
  t.deepLooseEqual(getInitialState({}), {});

  // $FlowFixMe
  t.deepLooseEqual(getInitialState({res: {locals: {}}}), {});

  // $FlowFixMe
  t.deepLooseEqual(getInitialState({res: {locals: {state: {test: true}}}}), {
    test: true,
  });
  t.end();
});
