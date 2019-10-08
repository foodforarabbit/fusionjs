// @flow
/* eslint-env node */
import puppeteer from 'puppeteer';
import type {Page} from 'puppeteer';
import {join} from 'path';
import {toMatchImageSnapshot} from 'jest-image-snapshot';

expect.extend({toMatchImageSnapshot});

export default async function integrationTest(
  url: string,
  withPage: (page: Page) => Promise<any>
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(`http://localhost:3000${join('/', url)}`);
  } catch (e) {
    await cleanup();
    throw new Error('App is not running. Run `yarn dev` first');
  }

  try {
    await withPage(page);
  } catch (e) {
    await cleanup();
    throw e;
  }

  await cleanup();

  async function cleanup() {
    await page.close();
    await browser.close();
  }
}
