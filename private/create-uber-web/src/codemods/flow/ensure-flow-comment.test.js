// @flow
import {ensureFlowComment} from './ensure-flow-comment.js';

test('ignores @noflow', async () => {
  const contents = `
  // @noflow
  createToken("");
  `;
  const newContents = await ensureFlowComment(contents);
  expect(newContents).toMatchInlineSnapshot(`
    "
      // @noflow
      createToken(\\"\\");
      "
  `);
});

test('add @flow', async () => {
  const contents = `
  /**
   * @some-other-comment
   */
  createToken("");
  `;
  const newContents = await ensureFlowComment(contents);
  expect(newContents).toMatchInlineSnapshot(`
    "// @flow

      /**
       * @some-other-comment
       */
      createToken(\\"\\");
      "
  `);
});

test('ignore @flow', async () => {
  const contents = `
  /**
   * @flow
   */
  createToken("");
  `;
  const newContents = await ensureFlowComment(contents);
  expect(newContents).toMatchInlineSnapshot(`
    "
      /**
       * @flow
       */
      createToken(\\"\\");
      "
  `);
});
