/* @noflow */

import {serverWrapper} from './server.js';
import {clientWrapper} from './client.js';
import clientRender from './default-client-render.js';
import serverRender from './default-server-render.js';

/**
 * This is implemented as an FusionApp mixin that wraps
 * the render function instead of a Fusion plugin because
 * legacy styletron is a singleton. As such, it inherently
 * depends on synchronous render on the server in order to
 * work properly, meaning a normal middleware won't suffice.
 */

const defaultRender = __NODE__ ? serverRender : clientRender;

export const legacyStyling = App =>
  class extends App {
    constructor(el, render) {
      render = render || defaultRender;
      if (__BROWSER__) {
        super(el, clientWrapper(render));
      } else {
        super(el, serverWrapper(render));
      }
    }
  };