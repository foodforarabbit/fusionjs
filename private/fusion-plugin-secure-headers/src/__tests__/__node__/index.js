import tape from 'tape-cup';
import Middleware from '../../server';

tape('Server interface', t => {
  t.equal(typeof Middleware, 'function', 'exports a default function');
  t.end();
});
