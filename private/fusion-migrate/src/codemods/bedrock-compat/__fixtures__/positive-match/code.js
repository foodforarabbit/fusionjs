import m3 from '@uber/bedrock/universal-m3';
import createServer from '@uber/bedrock';
function thing() {
  m3.increment('test');
  createServer();
}
