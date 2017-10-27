/* eslint-env node */
import {Plugin} from '@uber/graphene-plugin';
import {html} from '@uber/graphene-app';

export default function() {
  const escaped = html`<script async src='https://www.google-analytics.com/analytics.js'></script>`;
  class GAServer {
    constructor() {
      throw new Error('Google analytics cannot be used on the server');
    }
  }

  function middleware(ctx, next) {
    if (ctx.element) {
      ctx.body.head.push(escaped);
    }
    return next();
  }
  return new Plugin({middleware, Service: GAServer});
}
