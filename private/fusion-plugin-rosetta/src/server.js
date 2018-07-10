/* eslint-env node */
import {createPlugin, memoize, createToken} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {Locales} from 'locale';
import Genghis from '@uber/node-genghis';

export const ClientToken = createToken('RosettaClient');
export const ConfigToken = createToken('RosettaConfig');
export const LocaleNegotiationToken = createToken('RosettaLocaleNegotiation');

class TranslationsLoader {
  constructor({locale, translations}) {
    this.locale = locale;
    this.translations = translations;
  }
}

/* Locale negotiation strategy using the Accept-Language request header.
 *
 * This function implements a locale negotiation strategy based on the client
 * Accept-Language header. An override locale negotiation strategy may be
 * provided using the LocaleNegotiationToken. Locale negotiation strategies
 * must have the following type signature:
 *
 *     (ctx: Context, supportedLocales: Locales) => Locale
 *
 * Locale negotiation strategies work in terms of the Locales and Locale classes
 * defined in the `'locale'` package.
 */
function defaultLocaleNegotiationStrategy(ctx, supportedLocales) {
  const expectedLocales = new Locales(ctx.headers['accept-language']);
  return expectedLocales.best(supportedLocales);
}

function translationsLoaderFactory(client, localeNegotiationStrategy) {
  const supportedLocales = new Locales(client.locales);

  return ctx => {
    const locale = localeNegotiationStrategy(ctx, supportedLocales);

    const normalizedLocale = locale.normalized;
    const translations =
      client.translations[normalizedLocale] ||
      client.translations[normalizedLocale.replace('_', '-')];

    return new TranslationsLoader({locale, translations});
  };
}

export default __NODE__ &&
  createPlugin({
    deps: {
      logger: LoggerToken,
      Client: ClientToken.optional,
      config: ConfigToken.optional,
      localeNegotiation: LocaleNegotiationToken.optional,
    },
    provides: ({logger, Client = Genghis, config = {}, localeNegotiation}) => {
      config.service = config.service || process.env.SVC_ID || 'dev-service';
      const client = new Client({logger, ...config});
      client.load();
      client.setLoadInterval();

      const realLocaleNegotiationStrategy =
        localeNegotiation || defaultLocaleNegotiationStrategy;

      client.from = memoize(
        translationsLoaderFactory(client, realLocaleNegotiationStrategy)
      );
      return client;
    },
    cleanup: client => client.clearInterval(),
  });
