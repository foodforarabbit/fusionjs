// @flow
/* eslint-env node */
import puppeteer from 'puppeteer';

test('Page has content', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3000/');
  } catch (e) {
    await cleanup();
    throw new Error('App is not running. Run `yarn dev` first');
  }
  const content = await page.content();
  expect(content.length > 0).toEqual(true);

  await cleanup();

  async function cleanup() {
    await page.close();
    await browser.close();
  }
});
