/* eslint-env node */
import test from 'tape-cup';
import plugin from '../../server';
import {consumeSanitizedHTML} from 'fusion-core';

test('Tealium plugin - server init', t => {
  const tealium = plugin({
    config: {
      account: 'foo',
      profile: 'main',
      env: 'prod',
      geo: 'NL',
    },
  });

  const ctx = {
    element: {},
    nonce: 'abc123',
    body: {
      head: {
        push: h => {
          t.equal(
            consumeSanitizedHTML(h),
            "<script async nonce='abc123' src='https:\\u002F\\u002Ftags.tiqcdn.com\\u002Futag\\u002Ffoo\\u002Fstrict\\u002Fprod\\u002Futag.js'></script>",
            'constructs and sanitizes script tag correctly'
          );
          t.pass('script tag pushed');
        },
      },
    },
  };

  const next = () => t.pass('next() called');

  tealium.middleware(ctx, next);
  t.end();
});
