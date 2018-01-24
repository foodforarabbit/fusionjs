// @flow
import type {M3Emitter} from '../emitters/m3';
import type {Log} from '../emitters/logger';

export default function rpcHandlers(
  events: EventEmitter,
  m3: M3Emitter,
  log: Log
) {
  events.on('rpc:error', ({origin, error}) => {
    m3.increment({key: 'rpc_missing_handler', tags: {origin}});
    log({level: 'error', message: error.message, meta: error});
  });
  events.on('rpc:method', ({method, origin, timing, status, error}) => {
    m3.timing({
      key: 'web_rpc_method',
      value: timing,
      tags: {rpc_id: method, status, origin},
    });
    if (error) {
      log({level: 'error', message: error.message, meta: error});
    }
  });
}
