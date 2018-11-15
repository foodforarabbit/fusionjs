// @noflow
import {createPlugin, html} from 'fusion-core';
import type {Context} from 'fusion-core';

import {PageSkeletonConfigToken} from './tokens.js';

export default createPlugin({
  deps: {config: PageSkeletonConfigToken.optional},

  middleware: ({
    config = {},
  }): ((ctx: Context, next: () => Promise<void>) => Promise<void>) => {
    return async (ctx: Context, next: () => Promise<void>): Promise<void> => {
      await next();
      if (!ctx.element) {
        return;
      }
      if (config.faviconUrl) {
        ctx.template.head.push(
          html`<link rel='icon' type='image/x-icon' href='${
            config.faviconUrl
          }' />`
        );
      }
      if (config.stylesheetUrl) {
        ctx.template.head.push(
          html`<link rel='stylesheet' href='${config.stylesheetUrl}' />`
        );
      }
      if (config.includeIcons) {
        ctx.template.head.push(
          html`<link rel='stylesheet' href='https://d1a3f4spazzrp4.cloudfront.net/uber-icons/3.15.0/uber-icons.css' />`
        );
      }
      if (config.includeFonts) {
        ctx.template.head.push(
          html`<link rel='stylesheet' href='https://d1a3f4spazzrp4.cloudfront.net/uber-fonts/4.0.0/superfine.css' />`
        );
      }
    };
  },

  provides: (): (() => string) => {
    return function renderPageSkeleton(): string {
      return `<div id='root'></div>`;
    };
  },
});
