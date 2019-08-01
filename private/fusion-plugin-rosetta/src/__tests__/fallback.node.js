// @flow
import tape from 'tape-cup';

import getTranslatons from '../fallback.js';

tape('getTranslatons', t => {
  const client = {
    locales: ['ar'],
    translations: {
      'ar-SA': {
        ab: 'ab',
      },
      en: {
        hello: 'world',
      },
    },
    fallback: [{locale: 'ar-AE', fallbacks: ['ar-SA', 'en']}],
    bestmatch: {
      ar: 'ar-AE',
    },
  };

  t.deepLooseEqual(
    getTranslatons(client, 'ar-SA'),
    {ab: 'ab'},
    'getTranslations directly'
  );
  t.deepLooseEqual(
    getTranslatons(client, 'ar_SA'),
    {ab: 'ab'},
    'getTranslations directly'
  );
  t.deepLooseEqual(
    getTranslatons(client, 'ar-AE'),
    {ab: 'ab'},
    'getTranslations from fallback chain'
  );
  t.deepLooseEqual(
    getTranslatons(client, 'ar'),
    {ab: 'ab'},
    'getTranslations from bestmatch'
  );
  t.deepLooseEqual(
    getTranslatons(client, 'ar-AR'),
    {ab: 'ab'},
    'getTranslations from bestmatch'
  );
  t.deepLooseEqual(
    getTranslatons(client, 'ch'),
    {hello: 'world'},
    'fallback to en'
  );
  t.end();
});
