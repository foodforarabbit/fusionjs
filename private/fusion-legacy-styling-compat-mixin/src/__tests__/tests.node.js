import tape from 'tape-cup';

import styletron from 'styletron-legacy';

import {serverWrapper} from '../server.js';

tape('serverWrapper', async t => {
  // Render *could* take arbitrary arguments,
  // all should be passed through transparently.
  const mockRender = (shouldStyle, ...content) => {
    if (shouldStyle) {
      styletron.injectOnce('.foo {color: red}', 'foo_key');
    }
    return `<div${shouldStyle ? ' class="foo"' : ''}>${content.join('')}</div>`;
  };

  const wrapped = serverWrapper(mockRender);

  t.equal(wrapped(false, 'hello'), `<div>hello</div>`);
  t.equal(wrapped(false, 'hi', ' ', 'world'), `<div>hi world</div>`);

  t.equal(
    wrapped(true, 'hello'),
    `<style>.foo{color:red}</style><div class="foo">hello</div><script id="_fusion_legacy_styling_hydration_keys_" type="application/json">["foo_key"]</script>`
  );

  t.end();
});
