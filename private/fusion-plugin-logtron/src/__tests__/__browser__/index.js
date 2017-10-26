import tape from 'tape-cup';
import Plugin from '../../browser';

tape('browser plugin interface', t => {
  t.equal(typeof Plugin, 'function', 'exports a default function');
  t.end();
});
