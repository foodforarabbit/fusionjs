/* eslint-env node */

import {createPlugin, html} from 'fusion-core';
import {TealiumConfigToken as ConfigToken} from './tokens';

const StrictGeo = ['NL', 'FR'];

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      config: ConfigToken,
    },
    middleware: deps => (ctx, next) => {
      let {account, profile, env, geo} = deps.config;

      // Load the strict profile for specific regions
      profile = StrictGeo.includes(geo) ? 'strict' : profile;

      const url = `https://tags.tiqcdn.com/utag/${account}/${profile}/${env}/utag.js`;

      const nonce = ctx.nonce || '';
      if (ctx.element) {
        ctx.body.head.push(
          html`<script async nonce='${nonce}' src='${url}'></script>`
        );
      }
      return next();
    },
  });

export default plugin;
