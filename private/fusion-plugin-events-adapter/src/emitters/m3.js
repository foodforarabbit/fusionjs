// @flow
type ValueArgs = {|
  key: string,
  value: number,
  tags?: Object,
|};
type IncrementArgs = {|
  key: string,
  tags?: Object,
|};
type M3Function = (payload: ValueArgs) => void;
type IncrementFunction = (payload: IncrementArgs) => void;

export type M3Emitter = {|
  counter: M3Function,
  increment: IncrementFunction,
  decrement: IncrementFunction,
  timing: M3Function,
  gauge: M3Function,
|};

export default function(events: EventEmitter): M3Emitter {
  return {
    counter(payload) {
      events.emit('m3:counter', payload);
    },
    increment(payload) {
      events.emit('m3:increment', payload);
    },
    decrement(payload) {
      events.emit('m3:decrement', payload);
    },
    timing(payload) {
      events.emit('m3:timing', payload);
    },
    gauge(payload) {
      events.emit('m3:gauge', payload);
    },
  };
}
