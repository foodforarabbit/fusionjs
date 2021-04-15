// @flow
/* eslint-env node */
import {dangerouslySetHTML} from 'fusion-core';

import type {Context} from 'fusion-core';

const StrictGeo = ['NL', 'FR'];

export function setupTealium({ctx, config}: {ctx: Context, config: Object}) {
  let {account, profile, env, geo} = config;

  if (!account || !profile || !env) {
    return;
  }

  // TODO: support geo, goes with long-term GeoIP support for web
  profile = StrictGeo.includes(geo) ? 'strict' : profile;

  // TODO: support some interpolation in configs instead of hard-coding envs
  env = __DEV__ ? 'dev' : env;

  const url = `https://tags.tiqcdn.com/utag/${account}/${profile}/${env}/utag.js`;

  const nonce = ctx.nonce || '';
  ctx.template.head.push(
    dangerouslySetHTML(`<script async nonce='${nonce}' src='${url}'></script>`)
  );
}
