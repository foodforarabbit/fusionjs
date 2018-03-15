/* eslint-env node */
import test from 'tape-cup';
import {consumeSanitizedHTML} from 'fusion-core';

import TealiumPlugin from '../server';

test('plugin - exported as expected', t => {
  t.ok(TealiumPlugin, 'plugin defined as expected');
  t.equal(typeof TealiumPlugin, 'object', 'plugin is an object');
  t.end();
});

test('plugin - server init', t => {
  const mockConfig = {
    account: 'foo',
    profile: 'main',
    env: 'prod',
    geo: 'NL',
  };

  const mockCtx = {
    element: {},
    nonce: 'abc123',
    template: {
      head: {
        push: h => {
          t.equal(
            consumeSanitizedHTML(h),
            "<script async nonce='abc123' src='https://tags.tiqcdn.com/utag/foo/strict/prod/utag.js'></script>",
            'constructs and sanitizes script tag correctly'
          );
          t.pass('script tag pushed');
        },
      },
    },
  };
  const mockNext = () => t.pass('next() called');

  t.plan(3);
  TealiumPlugin.middleware({
    config: mockConfig,
  })(mockCtx, mockNext);

  t.end();
});
