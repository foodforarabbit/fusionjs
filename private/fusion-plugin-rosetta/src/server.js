// @flow
/* eslint-env node */
import type {RosettaDepsType, ProvidesType} from './types';

import {Locales} from 'locale';

// $FlowFixMe
import Rosetta from '@uber/node-rosetta';

import {createPlugin, memoize} from 'fusion-core';
import type {Context} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';

import {ClientToken, ConfigToken, LocaleNegotiationToken} from './tokens';
import getTranslations from './fallback';

type ExtractReturnType = <R>(() => R) => R;

class TranslationsLoader {
  locale: any;
  translations: any;

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
function defaultLocaleNegotiationStrategy(
  ctx: Context,
  supportedLocales: any
): any {
  const expectedLocales = new Locales(ctx.headers['accept-language']);
  return expectedLocales.best(supportedLocales);
}

function translationsLoaderFactory(
  client: any,
  localeNegotiationStrategy: (ctx: Context, supportedLocales: any) => any
): (ctx: Context) => TranslationsLoader {
  const supportedLocales = new Locales(client.locales, 'en');

  return (ctx: Context): TranslationsLoader => {
    const locale = localeNegotiationStrategy(ctx, supportedLocales);

    const normalizedLocale = locale.normalized;
    // getTranslations gets the translation with a fallback strategy
    const translations = getTranslations(client, normalizedLocale);

    return new TranslationsLoader({locale, translations});
  };
}

const pluginFactory = () =>
  createPlugin<RosettaDepsType, ProvidesType>({
    deps: {
      logger: LoggerToken,
      Client: ClientToken.optional,
      config: ConfigToken.optional,
      localeNegotiation: LocaleNegotiationToken.optional,
    },

    provides: ({logger, Client = Rosetta, config = {}, localeNegotiation}) => {
      config.service = config.service || process.env.SVC_ID || 'dev-service';
      const client = new Client({logger, ...config});

      const API = {
        client,
        from: (ctx: Context): TranslationsLoader => {
          throw new Error('Cannot call from until client has loaded');
        },
      };

      client._loadPromise = client
        .load()
        .catch(e => {
          logger.error('Failed to load translations', e);
          throw e;
        })
        .then(() => {
          client.setLoadInterval();
          const realLocaleNegotiationStrategy =
            localeNegotiation || defaultLocaleNegotiationStrategy;
          API.from = memoize(
            translationsLoaderFactory(client, realLocaleNegotiationStrategy)
          );
        });

      return API;
    },

    middleware: ({localeNegotiation}, api) => {
      return async (ctx, next) => {
        // Ensures client is loaded before other middleware are executed
        await api.client._loadPromise;
        return next();
      };
    },

    cleanup: ({client}) => {
      client.clearInterval();
      return Promise.resolve();
    },
  });

type PluginType = $Call<ExtractReturnType, typeof pluginFactory>;
export default ((__NODE__ && pluginFactory(): any): PluginType);
