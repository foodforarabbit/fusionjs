// @flow
/* eslint-env node */
import puppeteer from 'puppeteer';
import {test} from 'fusion-test-utils';

test('Page has content', async assert => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const content = await page.content();
  assert.ok(content.length > 0);
  await page.close();
  await browser.close();
});
