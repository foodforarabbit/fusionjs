// @flow
/* eslint-env node */

import {createPlugin, dangerouslySetHTML} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {TealiumConfigToken as ConfigToken} from './tokens';

const StrictGeo = ['NL', 'FR'];

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      config: ConfigToken,
      logger: LoggerToken,
    },
    middleware: deps => async (ctx, next) => {
      if (!ctx.element) {
        return next();
      }

      const {config, logger} = deps;
      let resolvedConfig;
      try {
        resolvedConfig = await Promise.resolve(
          typeof config === 'function' ? config(ctx) : config
        );
      } catch (e) {
        logger.error('[fusion-plugin-tealium] Error resolving tealium config', {
          error: e,
        });
        throw e;
      }

      let {account, profile, env, geo} = resolvedConfig;

      // Load the strict profile for specific regions
      profile = StrictGeo.includes(geo) ? 'strict' : profile;

      const url = `https://tags.tiqcdn.com/utag/${account}/${profile}/${env}/utag.js`;

      const nonce = ctx.nonce || '';
      ctx.template.head.push(
        dangerouslySetHTML(
          `<script async nonce='${nonce}' src='${url}'></script>`
        )
      );
      return next();
    },
  });

export default plugin;
