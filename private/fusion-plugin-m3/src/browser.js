/* eslint-env browser */
import {Plugin} from '@uber/graphene-plugin';

export default function({UniversalEvents}) {
  return class M3BrowserPlugin extends Plugin {
    constructor(ctx) {
      super(ctx);
      const emitter = UniversalEvents.of();
      this.emit = emitter.emit.bind(emitter);
    }
    counter(key, value, tags) {
      this.emit('m3:counter', {key, value, tags});
    }
    increment(key, tags) {
      this.emit('m3:increment', {key, tags});
    }
    decrement(key, tags) {
      this.emit('m3:decrement', {key, tags});
    }
    timing(key, value, tags) {
      this.emit('m3:timing', {key, value, tags});
    }
    gauge(key, value, tags) {
      this.emit('m3:gauge', {key, value, tags});
    }
  };
}
