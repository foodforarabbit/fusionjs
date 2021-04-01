// @flow

import { matchesLiteralSections } from 'fusion-plugin-i18n';
import { type TranslationsType } from './types'

const ENGLISH_FALLBACK = 'en';

export function translateKeysV2(sources: any, locale: any, keys: string[]): TranslationsType {
  const translations = {}
  keys.forEach(key => {
    if (Array.isArray(key)) {
      const filter = matchesLiteralSections(key);
      for (let sourceKey in sources[ENGLISH_FALLBACK]) {
        if (filter(sourceKey)) {
          translations[sourceKey] = translateKeyV2(sources, locale, sourceKey);
        }
      }
    } else {
      translations[key] = translateKeyV2(sources, locale, key);
    }
  });
  return translations;
}


export function translateKeyV2(translations: any, locale: any, key: string): string | void {
  const { fallback, code } = locale;
  const localeKey = (translations[code] || {})[key];
  if (localeKey) {
    return localeKey
  }
  for (let i = 0; i < fallback.length; i++) {
    let fallbackKey = (translations[fallback[i]] || {})[key]
    if (fallbackKey) {
      return fallbackKey;
    }
  }
  const englishKey = (translations[ENGLISH_FALLBACK] || {})[key];
  if (englishKey) {
    return englishKey
  }

  return;
}

export const getTranslationsV2 = (client: any, locale: any) => {
  const { fallbacks } = client.fallback.find(f => f.locale === locale.code) || { fallbacks: [] };
  // Mutates the locale, safest way for backwards compatibility
  locale.fallback = fallbacks;
  if (client.bestmatch && client.bestmatch[locale.code]) {
    locale.fallback.push(client.bestmatch[locale.code])
  }

  return client.translations;
};
