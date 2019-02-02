// @flow
/* eslint-env node */

import {createPlugin, memoize, html} from 'fusion-core';
import type {Context} from 'fusion-core';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';

import MorpheusClient from './clients/morpheus.js';
import {
  FeatureTogglesClientToken,
  FeatureTogglesToggleNamesToken,
} from './tokens.js';
import type {
  ToggleDetailsType,
  FeatureTogglesServiceType,
  FeatureTogglesPluginType,
} from './types.js';

const pluginFactory: () => FeatureTogglesPluginType = () =>
  createPlugin({
    deps: {
      toggleNames: FeatureTogglesToggleNamesToken,
      Client: FeatureTogglesClientToken.optional,
      atreyu: AtreyuToken.optional,
    },
    provides({Client, atreyu}) {
      if (!Client) {
        if (!atreyu) throw new Error(generateErrorMessage('AtreyuToken'));
        Client = MorpheusClient;
      }

      const C = Client; // TODO: Remove this and ensure Flow does not complain
      const service: FeatureTogglesServiceType = {
        from: (ctx?: Context) => {
          if (!ctx)
            throw new Error(
              '[fusion-plugin-feature-toggles] Context not supplied.'
            );
          return memoize(ctx => new C(ctx, {atreyu}))(ctx);
        },
      };
      return service;
    },
    middleware({toggleNames}, service) {
      return async (ctx: Context, next) => {
        if (!ctx.element) return next();
        await next();

        const scoped = service.from(ctx);

        // Load all feature toggles data into an easily serializable object
        const data: {[string]: ToggleDetailsType} = {};
        for (let i = 0; i < toggleNames.length; i++) {
          const name = toggleNames[i];
          const details = await scoped.get(name);
          if (details) {
            data[name] = details;
          }
        }

        const serialized = JSON.stringify({data});
        const script = html`
          <script type="application/json" id="__FEATURE_TOGGLES__">
            ${serialized}
          </script>
        `; // to be consumed by ./browser.js
        ctx.template.body.push(script);
      };
    },
  });

export default ((__NODE__ && pluginFactory(): any): FeatureTogglesPluginType);

/* Helper functions */
const generateErrorMessage = (tokenName: string): string =>
  `No client was provided.  The default client requires a registered value for the ${tokenName}.`;
