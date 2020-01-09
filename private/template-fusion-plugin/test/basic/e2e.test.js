/**
 * @jest-environment node
 * @noflow
 */

/* eslint-env jest, node, browser */

const child_process = require('child_process');
const {promisify} = require('util');
const getPort = require('get-port');
const puppeteer = require('puppeteer');

const {untilReady, getComputedStyle, getStyles} = require('../utils.js');

const execFile = promisify(child_process.execFile);
const spawn = child_process.spawn;

const fixture = __dirname;

test('basic rendering and hydration works', async () => {
  const env = Object.assign({}, process.env, {NODE_ENV: 'production'});

  const [port] = await Promise.all([
    getPort(),
    execFile('fusion', ['build'], {cwd: fixture, env}),
  ]);

  const server = spawn('fusion', ['start', `--port=${port}`], {
    stdio: 'inherit',
    cwd: fixture,
    env,
  });

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await untilReady(page, port);
  await page.goto(`http://localhost:${port}`);

  const value = await page.$eval(
    '[data-testid="serialized-value"]',
    el => el.textContent
  );
  expect(value).toBe('__plugin__value__');

  server.kill();
  browser.close();
}, 30000);
