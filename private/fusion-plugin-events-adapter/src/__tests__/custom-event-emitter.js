// @flow

import EventEmitter from 'events';

export default class CustomEventEmitter extends EventEmitter {
  from() {
    return this;
  }
}
