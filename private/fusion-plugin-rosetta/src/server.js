import {Plugin} from 'fusion-core';
import {Locales} from 'locale';
import Genghis from '@uber/node-genghis';

export default ({Logger, Client = Genghis, ...config}) => {
  const logger = Logger.of();
  const client = new Client({logger, ...config});
  client.load();
  client.setLoadInterval();
  const supportedLocales = new Locales(client.locales);
  class TranslationsLoader {
    constructor(ctx) {
      // TODO: ctx should be null or undefined for ctx.of(). Right now it is an empty object
      if (!ctx || !ctx.headers) {
        return client;
      }
      const expectedLocales = new Locales(ctx.headers['accept-language']);
      this.locale = expectedLocales.best(supportedLocales); // TODO does it need to read from cookie __LOCALE__ or from requestedLocale?
      this.translations = client.translations[this.locale.toString()];
    }
  }
  return new Plugin({Service: TranslationsLoader});
};
