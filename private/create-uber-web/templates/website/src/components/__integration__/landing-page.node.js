// @flow
/* eslint-env node */
import puppeteer from 'puppeteer';

test('Page has content', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const content = await page.content();
  expect(content.length > 0).toEqual(true);
  await page.close();
  await browser.close();
});
