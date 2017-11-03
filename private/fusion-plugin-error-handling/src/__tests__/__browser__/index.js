import tape from 'tape-cup';
import plugin from '../../browser';
import errorHandling from 'fusion-plugin-error-handling';

tape('browser plugin re-exports', t => {
  t.equal(plugin, errorHandling);
  t.end();
});
