import tape from 'tape-cup';
import Middleware from '../../browser';

tape('browser interface', t => {
  t.equal(typeof Middleware, 'function', 'exports a default function');
  t.end();
});
