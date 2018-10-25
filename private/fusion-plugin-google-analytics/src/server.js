// @flow
/* eslint-env node */
import {createPlugin, html} from 'fusion-core';
import type {Context, FusionPlugin} from 'fusion-core';

const plugin =
  __NODE__ &&
  createPlugin({
    middleware: (): ((
      ctx: Context,
      next: () => Promise<void>
    ) => Promise<void>) => {
      const escaped = html`<script async src='https://www.google-analytics.com/analytics.js'></script>`;
      return function middleware(
        ctx: Context,
        next: () => Promise<void>
      ): Promise<void> {
        if (ctx.element) {
          ctx.template.head.push(escaped);
        }
        return next();
      };
    },
  });

export default ((plugin: any): FusionPlugin<any, any>);
