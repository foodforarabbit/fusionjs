import bedrock from '@uber/bedrock';
import middleware from './middleware';
import routes from './routes'; // -----------------

export default function startServer(options = {}, cb) {
  const server = bedrock.createServer(options);
  middleware(server);
  routes(server);
  server.listen(cb);
  return server;
}
