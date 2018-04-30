import Plugin, {InitializeServerToken, BedrockCompatToken} from '../index.js';
import tape from 'tape-cup';

tape('exports api', t => {
  t.ok(Plugin, 'export default a Plugin');
  t.ok(InitializeServerToken, 'exports an InitializeServerToken');
  t.ok(BedrockCompatToken, 'exports a BedrockCompatToken');
  t.end();
});
