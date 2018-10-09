// @flow
/* eslint-env node */
import {createPlugin, html} from 'fusion-core';

export default __NODE__ &&
  createPlugin({
    middleware: () => {
      const escaped = html`<script async src='https://www.google-analytics.com/analytics.js'></script>`;
      return function middleware(ctx, next) {
        if (ctx.element) {
          ctx.template.head.push(escaped);
        }
        return next();
      };
    },
  });
