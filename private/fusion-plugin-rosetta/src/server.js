/* eslint-env node */
import {createPlugin, memoize, createToken} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {Locales} from 'locale';
import Genghis from '@uber/node-genghis';

export const ClientToken = createToken('RosettaClient');
export const ConfigToken = createToken('RosettaConfig');

export default __NODE__ &&
  createPlugin({
    deps: {
      logger: LoggerToken,
      Client: ClientToken.optional,
      config: ConfigToken.optional,
    },
    provides: ({logger, Client = Genghis, config = {}}) => {
      config.service = config.service || process.env.SVC_ID || 'dev-service';
      const client = new Client({logger, ...config});
      client.load();
      client.setLoadInterval();
      const supportedLocales = new Locales(client.locales);
      class TranslationsLoader {
        constructor(ctx) {
          const expectedLocales = new Locales(ctx.headers['accept-language']);
          this.locale = expectedLocales.best(supportedLocales); // TODO does it need to read from cookie __LOCALE__ or from requestedLocale?

          const normalizedLocale = this.locale.normalized;
          this.translations =
            client.translations[normalizedLocale] ||
            client.translations[normalizedLocale.replace('_', '-')];
        }
      }
      client.from = memoize(ctx => new TranslationsLoader(ctx));
      return client;
    },
    cleanup: client => client.clearInterval(),
  });
