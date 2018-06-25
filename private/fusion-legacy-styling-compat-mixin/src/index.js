import {serverWrapper} from './server.js';
import {clientWrapper} from './client.js';

/**
 * This is implemented as an FusionApp mixin that wraps
 * the render function instead of a Fusion plugin because
 * legacy styletron is a singleton. As such, it inherently
 * depends on synchronous render on the server in order to
 * work properly, meaning a normal middleware won't suffice.
 */

export const legacyStyling = App =>
  class extends App {
    constructor(el, render) {
      if (__BROWSER__) {
        super(el, clientWrapper(render));
      } else {
        super(el, serverWrapper(render));
      }
    }
  };
