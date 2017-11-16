// @flow
type LogLevel =
  | 'trace'
  | 'debug'
  | 'info'
  | 'access'
  | 'warn'
  | 'error'
  | 'fatal';
type LogPayload = {|
  level: LogLevel,
  message: string,
  meta: Object,
|};

export type Log = (payload: LogPayload) => void;

export default function logger(events: EventEmitter) {
  return function log(payload: LogPayload) {
    return events.emit('logtron:log', payload);
  };
}
