// @flow
import tape from 'tape-cup';

import getTranslatons from '../fallback.js';

tape('getTranslatons', t => {
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

  t.deepLooseEqual(
    getTranslatons(client, 'en'),
    {
      hello: 'world',
      ab: 'en',
      ac: 'en',
    },
    'getTranslations en directly'
  );

  t.deepLooseEqual(
    getTranslatons(client, 'ar-SA'),
    {
      hello: 'world',
      ab: 'ar-SA',
      ac: 'ar-SA',
    },
    'getTranslations without finding the fallbacks'
  );

  t.deepLooseEqual(
    getTranslatons(client, 'ar-AE'),
    {
      hello: 'world',
      ab: 'ar-AE',
      ac: 'ar-SA',
    },
    'getTranslations from fallback chain'
  );

  t.deepLooseEqual(
    getTranslatons(client, 'ar'),
    {
      hello: 'world',
      ab: 'ar-AE',
      ac: 'ar-SA',
    },
    'getTranslations from bestmatch: ar'
  );

  t.deepLooseEqual(
    getTranslatons(client, 'ar-AR'),
    {
      hello: 'world',
      ab: 'ar-AE',
      ac: 'ar-SA',
    },
    'getTranslations from bestmatch: ar-AR'
  );

  t.deepLooseEqual(
    getTranslatons(client, 'ch'),
    {
      hello: 'world',
      ab: 'en',
      ac: 'en',
    },
    'locale not found, fallback to en'
  );
  t.end();
});
