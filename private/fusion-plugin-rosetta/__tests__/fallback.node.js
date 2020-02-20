// @flow
import getTranslatons from '../src/fallback.js';

test('getTranslatons', () => {
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

  expect(getTranslatons(client, 'en')).toStrictEqual({
    hello: 'world',
    ab: 'en',
    ac: 'en',
  }); // 'getTranslations en directly'

  expect(getTranslatons(client, 'ar-SA')).toStrictEqual({
    hello: 'world',
    ab: 'ar-SA',
    ac: 'ar-SA',
  }); // 'getTranslations without finding the fallbacks'

  expect(getTranslatons(client, 'ar-AE')).toStrictEqual({
    hello: 'world',
    ab: 'ar-AE',
    ac: 'ar-SA',
  }); // 'getTranslations from fallback chain'

  expect(getTranslatons(client, 'ar')).toStrictEqual({
    hello: 'world',
    ab: 'ar-AE',
    ac: 'ar-SA',
  }); // 'getTranslations from bestmatch: ar'

  expect(getTranslatons(client, 'ar-AR')).toStrictEqual({
    hello: 'world',
    ab: 'ar-AE',
    ac: 'ar-SA',
  }); // 'getTranslations from bestmatch: ar-AR'

  expect(getTranslatons(client, 'ch')).toStrictEqual({
    hello: 'world',
    ab: 'en',
    ac: 'en',
  }); // 'locale not found, fallback to en'
});
