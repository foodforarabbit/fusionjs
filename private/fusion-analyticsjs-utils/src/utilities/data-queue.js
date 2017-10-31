/* eslint-env browser */
'use strict';

function dataQueue(name) {
  if (typeof name !== 'string') throw new Error('Invalid data queue name');

  window[name] = window[name] || [];

  return function queue() {
    window[name].push.apply(window[name], arguments);
  };
}

export default dataQueue;
