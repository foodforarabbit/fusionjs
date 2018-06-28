// @flow
export default class TestEmitter {
  constructor() {
    this.events = {};
  }
  events: {[string]: Function};

  emit(event: mixed) {
    if (typeof event === 'string' && this.events[event]) {
      this.events[event]();
    }
  }

  on(event: string, callback: Function) {
    this.events[event] = callback;
  }
}
