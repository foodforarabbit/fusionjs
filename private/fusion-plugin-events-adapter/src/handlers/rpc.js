// @noflow
export default function rpcHandlers({events, m3, logger}) {
  events.on('rpc:error', ({origin, error}) => {
    m3.increment('rpc_missing_handler', {origin});
    logger.error(error.message, error);
  });
  events.on('rpc:method', ({method, origin, timing, status, error}) => {
    m3.timing('web_rpc_method', timing, {rpc_id: method, status, origin});
    m3.histogram('web_rpc_method_latency', timing, {
      rpc_id: method,
      status,
      origin,
    });
    if (error) {
      logger.error(error.message, error);
    }
  });
}
