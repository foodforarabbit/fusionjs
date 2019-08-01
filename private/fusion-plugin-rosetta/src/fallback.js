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
  // 1. try to find direct match
  let translations = getTranslationsDirectly(client.translations, targetLocale);
  if (translations) {
    return translations;
  }
  // 2. check in the fallback sequence
  translations = getTranslationsWithFallBack(
    client.translations,
    client.fallback,
    client.bestmatch,
    targetLocale
  );

  // default return 'en' or empty, if no fallback found
  return (
    translations || getTranslationsDirectly(client.translations, 'en') || {}
  );
};

const getTranslationsDirectly = (translations: Object, locale: string) => {
  if (!locale) {
    return null;
  }
  return translations[locale];
};

const getTranslationsWithFallBack = (
  translations: Object,
  fallback: Array<Object>,
  bestmatch: Object,
  targetLocale: string
) => {
  if (!targetLocale) {
    return null;
  }
  // Check the fallback chain first
  const translationsFromFallback = findTranslationsInFallBackChain(
    translations,
    fallback,
    targetLocale
  );
  if (translationsFromFallback) {
    return translationsFromFallback;
  }
  // If not found in fallback chain, check the bestmatch locale
  const matchedLocale = findMatchedLocale(bestmatch, targetLocale);
  return findTranslationsInFallBackChain(translations, fallback, matchedLocale);
};

const findMatchedLocale = (bestmatch: Object, targetLocale: string) => {
  if (bestmatch[targetLocale]) {
    return bestmatch[targetLocale];
  }
  const prefixLocale = targetLocale.split(/_|-/)[0];
  return bestmatch[prefixLocale];
};

const findTranslationsInFallBackChain = (
  translations: Object,
  fallback: Array<Object>,
  targetLocale: string
) => {
  const selected = fallback.filter(
    sequence => sequence && sequence.locale === targetLocale
  );
  if (selected.length > 0) {
    const fallbacks = selected[0].fallbacks;
    const fallbackLocale =
      fallbacks &&
      fallbacks.find(fallbackLocale =>
        getTranslationsDirectly(translations, fallbackLocale)
      );
    return getTranslationsDirectly(translations, fallbackLocale);
  }
  return null;
};

export default getTranslations;
