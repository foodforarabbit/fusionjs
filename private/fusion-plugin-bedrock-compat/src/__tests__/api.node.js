import Plugin, {InitializeServerToken} from '../index.js';
import tape from 'tape-cup';

tape('exports api', t => {
  t.ok(Plugin, 'export default a Plugin');
  t.ok(InitializeServerToken, 'exports an InitializeServerToken');
  t.end();
});
