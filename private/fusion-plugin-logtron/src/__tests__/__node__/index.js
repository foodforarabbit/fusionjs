import tape from 'tape-cup';
import Plugin from '../../server';

tape('server plugin interface', t => {
  t.equal(typeof Plugin, 'function', 'exports a default function');
  t.end();
});
