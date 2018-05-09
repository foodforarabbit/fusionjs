import tape from 'tape-cup';
import getInitialState from '../index.js';

tape('getInitialState', t => {
  t.deepLooseEqual(getInitialState({}), {});
  t.deepLooseEqual(
    getInitialState({
      res: {
        locals: {},
      },
    }),
    {}
  );
  t.deepLooseEqual(
    getInitialState({
      res: {
        locals: {
          state: {
            test: true,
          },
        },
      },
    }),
    {
      test: true,
    }
  );
  t.end();
});
