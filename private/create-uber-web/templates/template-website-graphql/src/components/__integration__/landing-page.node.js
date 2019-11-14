// @flow
/* eslint-env node */
import integrationTest from '../../test-utils/integration-test';

test('Page has content', async () => {
  await integrationTest('/', async page => {
    const content = await page.content();
    expect(content.length > 0).toEqual(true);
  });
});
