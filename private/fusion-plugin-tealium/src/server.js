/* eslint-env node */
import {Plugin, html} from 'fusion-core';

const StrictGeo = ['NL', 'FR'];

export default function({config}) {
  let {account, profile, env, geo} = config;

  // Load the strict profile for specific regions
  profile = StrictGeo.includes(geo) ? 'strict' : profile;

  const url = `https://tags.tiqcdn.com/utag/${account}/${profile}/${env}/utag.js`;

  return new Plugin({
    Service: class TealiumServer {
      constructor() {
        throw new Error('Tealium plugin cannot be used on the server');
      }
    },
    middleware: (ctx, next) => {
      const nonce = ctx.nonce || '';
      if (ctx.element) {
        ctx.body.head.push(
          html`<script async nonce='${nonce}' src='${url}'></script>`
        );
      }
      return next();
    },
  });
}
