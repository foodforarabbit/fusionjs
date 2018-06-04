import bedrock from '@uber/bedrock';
import middleware from './middleware';
import routes from './routes';
import _ from 'lodash';

export default function startServer(options = {}, cb) {
  const server = bedrock.createServer(options);
  setInterval(() => {
    bedrock.loadConfig(options);
  }, 1000);
  middleware(server);
  routes(server);
  server.listen(cb);
  return server;
}
