/* eslint-env node */

import test from 'tape-cup';
import plugin from '../../server';

test('interface', async t => {
  t.equals(typeof plugin, 'function');

  let numConstructors = 0;
  class Client {
    constructor(config, options) {
      numConstructors++;
      t.equal(numConstructors, 1, 'only calls constructor once');
      t.equal(config, 'abc');
      t.equal(options, 2);
    }
  }
  const Atreyu = plugin({config: 'abc', options: 2, Client});
  const instance = Atreyu.of();
  t.ok(instance instanceof Client, 'passes through context');

  // check for singleton
  const nextInstance = Atreyu.of();
  t.equal(instance, nextInstance, 'uses singleton');
  t.end();
});
