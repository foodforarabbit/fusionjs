/* eslint-env node */
import {Plugin} from '@uber/graphene-plugin';
import {html} from '@uber/graphene-app';

export default function() {
  const escaped = html`<script async src='https://www.google-analytics.com/analytics.js'></script>`;
  return class extends Plugin {
    constructor() {
      super();
      throw new Error('Google analytics cannot be used on the server');
    }
    static middleware(ctx, next) {
      if (ctx.element) {
        ctx.body.head.push(escaped);
      }
      return next();
    }
  };
}
