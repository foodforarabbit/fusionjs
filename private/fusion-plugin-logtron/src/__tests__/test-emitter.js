export default class TestEmitter {
  constructor() {
    this.events = {};
  }

  emit(event) {
    if (this.events[event]) {
      this.events[event]();
    }
  }

  on(event, callback) {
    this.events[event] = callback;
  }
}
