// @flow
export default class TestEmitter {
  constructor() {
    this.events = {};
  }
  events: {[string]: Function};

  emit(event: mixed, ...data: any) {
    if (typeof event === 'string' && this.events[event]) {
      this.events[event](...data);
    }
  }

  on(event: string, callback: Function) {
    this.events[event] = callback;
  }
}
