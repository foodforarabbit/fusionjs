/* @noflow */
import styletron from 'styletron-legacy';

import {serverWrapper} from '../server.js';

test('serverWrapper', async () => {
  // Render *could* take arbitrary arguments,
  // all should be passed through transparently.
  const mockRender = (shouldStyle, ...content) => {
    if (shouldStyle) {
      styletron.injectOnce('.foo {color: red}', 'foo_key');
    }
    return `<div${shouldStyle ? ' class="foo"' : ''}>${content.join('')}</div>`;
  };

  const wrapped = serverWrapper(mockRender);

  expect(wrapped(false, 'hello')).toBe(`<div>hello</div>`);
  expect(wrapped(false, 'hi', ' ', 'world')).toBe(`<div>hi world</div>`);

  expect(wrapped(true, 'hello')).toBe(
    `<style>.foo{color:red}</style><div class="foo">hello</div><script id="_fusion_legacy_styling_hydration_keys_" type="application/json">["foo_key"]</script>`
  );
});
