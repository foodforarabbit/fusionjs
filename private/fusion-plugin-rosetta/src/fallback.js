// @flow

// the fallback logic is same from go-rosetta
const getTranslations = (client: any, targetLocale: string) => {
  if (
    !client ||
    !client.translations ||
    Object.keys(client.translations).length === 0
  ) {
    return {};
  }

  // get translations first
  let translations = getTranslationsOnly(client, targetLocale);

  // If not found the translations, try the best match
  if (Object.keys(translations).length === 0) {
    const matchedLocale = findMatchedLocale(client.bestmatch, targetLocale);
    translations = getTranslationsOnly(client, matchedLocale);
  }

  // En all translations as the final fallback
  const en_translations = getTranslationsDirectly(client.translations, 'en');

  // generate translations with priorities
  return Object.assign({}, en_translations, translations);
};

const getTranslationsOnly = (client: any, locale: string) => {
  // 1. get the native translations
  const native_translations = getTranslationsDirectly(
    client.translations,
    locale
  );

  // 2. get the fallback_translations from fallbackChain
  const fallback_translations = getTranslationsWithFallBack(
    client.translations,
    client.fallback,
    locale
  );

  return Object.assign({}, fallback_translations, native_translations);
};

const getTranslationsDirectly = (translations: Object, locale: string) => {
  if (!locale) {
    return {};
  }
  return translations[locale] || {};
};

const findMatchedLocale = (bestmatch: Object, targetLocale: string) => {
  if (bestmatch[targetLocale]) {
    return bestmatch[targetLocale];
  }
  const prefixLocale = targetLocale.split(/_|-/)[0];
  return bestmatch[prefixLocale];
};

const getTranslationsWithFallBack = (
  translations: Object,
  fallback: Array<Object>,
  targetLocale: string
) => {
  if (!fallback) {
    return {};
  }
  const selected = fallback.filter(
    sequence => sequence && sequence.locale === targetLocale
  );
  //ignore if only 'en' in the fallback array
  if (selected[0] && selected[0].fallbacks) {
    const fallbacks = selected[0].fallbacks;
    return fallbacks.reduce((fallback_translations, locale) => {
      // exclude to use 'en' as fallback
      if (locale !== 'en') {
        fallback_translations = Object.assign(
          {},
          getTranslationsDirectly(translations, locale),
          fallback_translations
        );
      }
      return fallback_translations;
    }, {});
  }
  return {};
};

export default getTranslations;
