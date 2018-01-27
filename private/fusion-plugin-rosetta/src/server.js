/* eslint-env node */
import {createPlugin, memoize} from 'fusion-core';
import {LoggerToken, createOptionalToken} from 'fusion-tokens';
import {Locales} from 'locale';
import Genghis from '@uber/node-genghis';

export const ClientToken = createOptionalToken('RosettaClient', Genghis);
export const ConfigToken = createOptionalToken('RosettaConfig', {});

export default __NODE__ &&
  createPlugin({
    deps: {
      logger: LoggerToken,
      Client: ClientToken,
      config: ConfigToken,
    },
    provides: deps => {
      const {logger, Client, config} = deps;
      config.service = config.service || process.env.SVC_ID || 'dev-service';
      const client = new Client({logger, ...config});
      client.load();
      client.setLoadInterval();
      const supportedLocales = new Locales(client.locales);
      class TranslationsLoader {
        constructor(ctx) {
          const expectedLocales = new Locales(ctx.headers['accept-language']);
          this.locale = expectedLocales.best(supportedLocales); // TODO does it need to read from cookie __LOCALE__ or from requestedLocale?
          this.translations = client.translations[this.locale.normalized];
        }
      }
      client.from = memoize(ctx => new TranslationsLoader(ctx));
      return client;
    },
  });
