// @flow
import * as i18n from 'fusion-plugin-i18n';
import { translateKeysV2, translateKeyV2, getTranslationsV2 } from '../src/get-translations-v2.js';


const client = {
  locales: ['ar'],
  translations: {
    'ar-AE': {
      ab: 'ar-AE',
    },
    'ar-SA': {
      ab: 'ar-SA',
      ac: 'ar-SA',
    },
    en: {
      hello: 'world',
      ab: 'en',
      ac: 'en',
    },
  },
  fallback: [{locale: 'ar-AE', fallbacks: ['ar-SA', 'en']}],
  bestmatch: {
    ar: 'ar-AE',
  },
};

describe('getTranslationsV2', () => {
  test('should not append fallback and bestmatch', () => {
    const locale = {code: 'en'}
    const result = getTranslationsV2(client, locale);
    expect(locale).toStrictEqual({
      "code": "en",
      "fallback": []
    })
  })
  test('should append fallback', () => {
    const locale = { code: 'ar-AE' }
    const result = getTranslationsV2(client, locale);
    expect(locale).toStrictEqual({
      "code": "ar-AE",
      "fallback": [
        "ar-SA",
        "en",
      ]
    })
  })
});



describe('translateKeysV2', () => {
  const keys = ['hello', 'ab', 'ac']

  const testCases = [{
    name: 'getTranslations en directly',
    locale: { code: 'en', fallback: [] },
    result: {
      hello: 'world',
      ab: 'en',
      ac: 'en'
    },
  },
  {
    name: 'getTranslations without finding the fallbacks',
    locale: { code: 'ar-SA', fallback: [] },
    result: {
      hello: 'world',
      ab: 'ar-SA',
      ac: 'ar-SA',
    }
    },
    {
      name: 'getTranslations from fallback chain',
      locale: { code: 'ar-AE', fallback: ['ar-SA', 'en'] },
      result: {
        hello: 'world',
        ab: 'ar-AE',
        ac: 'ar-SA',
      }
    },
    {
      name: 'getTranslations from bestmatch: ar',
      locale: { code: 'ar', fallback: ['ar-AE'] },
      result: {
        hello: 'world',
        ab: 'ar-AE',
        ac: 'en',
      }
    },
    {
      name: 'getTranslations from bestmatch: ar-AR',
      locale: { code: 'ar-AR', fallback: ['ar-AE'] },
      result: {
        hello: 'world',
        ab: 'ar-AE',
        ac: 'en',
      }
    },
    {
      name: 'locale not found, fallback to en',
      locale: { code: 'ch', fallback: [] },
      result: {
        hello: 'world',
        ab: 'en',
        ac: 'en',
      }
    }
  ]

  testCases.forEach(({name, locale, result}) => {
    test(name, () => {
      expect(translateKeysV2(client.translations, locale, keys)).toStrictEqual(result)
    })
  })
});
