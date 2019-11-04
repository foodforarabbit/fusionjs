// @flow
/* eslint-env node */

import {createPlugin, memoize, html} from 'fusion-core';
import type {Context} from 'fusion-core';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {UberMarketingToken} from '@uber/fusion-plugin-marketing';
import MorpheusClient from './clients/morpheus.js';
import {
  FeatureTogglesClientToken,
  FeatureTogglesTogglesConfigToken,
  FeatureTogglesClientConfigToken,
} from './tokens.js';
import type {
  FeatureToggleConfigType,
  ToggleDetailsType,
  FeatureTogglesServiceType,
  FeatureTogglesPluginType,
} from './types.js';

const pluginFactory: () => FeatureTogglesPluginType = () =>
  createPlugin({
    deps: {
      toggleConfigs: FeatureTogglesTogglesConfigToken,
      Client: FeatureTogglesClientToken.optional,
      clientConfig: FeatureTogglesClientConfigToken.optional,
      atreyu: AtreyuToken.optional, // explicitly used by bundled Morpheus client
      marketing: UberMarketingToken.optional, // implicitly used by bundled Morpheus client
    },
    provides({toggleConfigs, Client, clientConfig, atreyu}) {
      const config = clientConfig || Object.freeze({});

      if (!Client) {
        if (!atreyu) throw new Error(generateErrorMessage('AtreyuToken'));
        Client = MorpheusClient;
      }

      const toggleNames = toggleConfigs.map(config =>
        typeof config === 'string' ? config : config.name
      );
      const C = Client; // TODO: Remove this and ensure Flow does not complain
      const scoper = memoize(ctx => new C(ctx, toggleNames, {atreyu}, config));
      const service: FeatureTogglesServiceType = {
        from: (ctx?: Context) => {
          if (!ctx)
            throw new Error(
              '[fusion-plugin-feature-toggles] Context not supplied.'
            );
          return scoper(ctx);
        },
      };
      return service;
    },
    middleware({toggleConfigs}, service) {
      return async (ctx: Context, next) => {
        if (!ctx.element) return next();
        if (toggleConfigs.length === 0) {
          embedToggleData(ctx, {} /*no toggle details*/);
          return next();
        }

        const scoped = service.from(ctx);
        await scoped.load();

        await next();

        // Load all feature toggles data into an easily serializable object
        const data: {[string]: ToggleDetailsType} = {};
        for (let i = 0; i < toggleConfigs.length; i++) {
          // Construct 'FeatureToggleConfigType' if a string is provided
          let config = toggleConfigs[i];
          if (typeof config === 'string') {
            config = ({
              name: config,
              exposeToClient: true, // if not defined, defaults to true
            }: FeatureToggleConfigType);
          }

          // Determine whether to expose token to client
          if (!config.exposeToClient) {
            continue;
          }

          const details = scoped.get(config.name);
          if (details) {
            data[config.name] = details;
          }
        }

        embedToggleData(ctx, data);
      };
    },
  });

export default ((__NODE__ && pluginFactory(): any): FeatureTogglesPluginType);

/* Helper functions */
const generateErrorMessage = (tokenName: string): string =>
  `No client was provided.  The default client requires a registered value for the ${tokenName}.`;

const embedToggleData = (
  ctx: Context,
  data: {[string]: ToggleDetailsType}
): void => {
  const serialized = JSON.stringify({data});
  const script = html`
    <script type="application/json" id="__FEATURE_TOGGLES__">
      ${serialized}
    </script>
  `; // to be consumed by ./browser.js
  ctx.template.body.push(script);
};
