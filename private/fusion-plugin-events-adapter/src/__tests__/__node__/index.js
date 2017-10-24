import Plugin from '../../server';
import tape from 'tape-cup';

tape('Server plugin api', t => {
  t.equal(typeof Plugin, 'function', 'exports a function');
  t.end();
});
