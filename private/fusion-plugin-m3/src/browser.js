/* eslint-env browser */
import {SingletonPlugin} from '@uber/graphene-plugin';

export default function({UniversalEvents}) {
  class M3BrowserPlugin {
    constructor() {
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
  }
  return new SingletonPlugin({Service: M3BrowserPlugin});
}
