// @flow

/* globals window, console */
/* eslint-disable no-console */

import test from 'tape-cup';
import App from 'fusion-core';
import puppeteer from 'puppeteer';
import {getSimulator} from 'fusion-test-utils';
import {startServer} from './utils.node';

import ServiceWorker from '../index';
import {SWTemplateFunctionToken} from '../tokens';
import swTemplateFunction from './fixtures/swTemplate.js';

// from fixture-apps/app
const cacheablePaths = [
  '/_static/client-main.js',
  '/_static/client-runtime.js',
  '/_static/client-vendor.js',
];

const precachePaths = [
  '/_static/client-main.js',
  '/_static/client-runtime.js',
  '/_static/client-vendor.js',
];

test('/health request', async t => {
  const app = new App('el', el => el);
  app.register(SWTemplateFunctionToken, swTemplateFunction);
  app.register(ServiceWorker);
  const sim = getSimulator(app);
  // Basic /health request
  const ctx_1 = await sim.request('/sw.js');
  t.equal(ctx_1.status, 200, 'sends 200 status on sw request');
  t.ok(
    String(ctx_1.body)
      .trim()
      .replace(/\n/g, '')
      .startsWith(`import {getHandlers} from '../../index'`),
    'sends correct response'
  );
  t.end();

  await app.cleanup();
});

test('/load-time caching', async t => {
  const hostname = 'http://localhost:';
  const {port, proc} = await startServer();
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-features=NetworkService',
    ],
    ignoreHTTPSErrors: true,
  });
  try {
    let isReady, controller, originalCacheDates;
    const page = await browser.newPage();
    page.on('console', msg => {
      if (msg._text.startsWith('[TEST] cached after first load:')) {
        const cacheKeys = msg._text.split('#')[1].split(',');
        t.ok(
          cacheKeys.length === precachePaths.length,
          'first page load: only precachePaths cached'
        );
        t.ok(
          precachePaths.every(path =>
            cacheKeys.includes(`${hostname}${port}${path}`)
          ),
          'first page load: cache names are same as precachePaths'
        );
        t.ok(
          !cacheKeys.includes(`${hostname}${port}/`),
          'first page load: html not cached'
        );
      } else if (msg._text.startsWith('[TEST] cached after second load:')) {
        const cacheKeys = msg._text.split('#')[1].split(',');
        t.ok(
          cacheKeys.length === cacheablePaths.length + 1, // add one for HTML
          'second page load: all cacheable resources cached'
        );
        t.ok(
          cacheablePaths.every(path =>
            cacheKeys.includes(`${hostname}${port}${path}`)
          ),
          'second page load: cached resources are same as cacheablePath names'
        );
        t.ok(
          cacheKeys.includes(`${hostname}${port}/`),
          'second page load: cached resources includes html path'
        );
      } else if (msg._text.startsWith('[TEST] cache dates after first load:')) {
        originalCacheDates = msg._text.split('#')[1].split(',');
        t.ok(
          originalCacheDates.length === precachePaths.length,
          'first page load: only precachePaths cached'
        );
      } else if (
        msg._text.startsWith('[TEST] cache dates after second load:')
      ) {
        const newCacheDates = msg._text.split('#')[1].split(',');
        t.ok(
          newCacheDates.length === cacheablePaths.length + 1, // add one for HTML
          'second page load: all cacheable resources cached'
        );
        t.ok(
          newCacheDates.every(cacheDate =>
            originalCacheDates.every(
              oldCacheDate => cacheDate > originalCacheDates
            )
          ),
          'second page load: all cache dates are greater than original cache dates'
        );
      }
    });

    // FIRST LOAD
    await page.goto(`${hostname}${port}`);

    isReady = await page.evaluate('navigator.serviceWorker.ready');
    t.ok(isReady, 'service worker is active');

    controller = await page.evaluate('navigator.serviceWorker.controller');
    t.notOk(
      controller,
      'first page load: page did not have existing service worker'
    );

    await logCachedURLs(page, '[TEST] cached after first load:');
    await logCacheDates(page, '[TEST] cache dates after first load:');

    // Capture requests during 2nd load.
    const allRequests = new Map();

    page.on('request', req => {
      allRequests.set(req.url(), req);
    });

    // wait one second between loads because puppteer and/or cache API appears to round to nearest second
    await page.waitFor(1000);

    // SECOND LOAD
    await page.reload({waitUntil: 'domcontentloaded'});
    controller = await page.evaluate('navigator.serviceWorker.controller');
    t.ok(
      controller,
      'second page load: page has an existing active service worker'
    );

    await logCachedURLs(page, '[TEST] cached after second load:');
    await logCacheDates(page, '[TEST] cache dates after second load:');

    t.ok(
      Array.from(allRequests.values())
        .filter(req =>
          cacheablePaths.find(
            path =>
              `${hostname}${port}${path}` === req.url() ||
              req.url() === `${hostname}${port}/` // html
          )
        )
        .every(req => req.response() && req.response().fromServiceWorker()),
      'all cacheable resources are fetched from service worker'
    );

    t.ok(
      Array.from(allRequests.values())
        .filter(
          req =>
            !cacheablePaths.find(
              path => `${hostname}${port}${path}` === req.url()
            )
        )
        .every(
          req =>
            req.resourceType() === 'document' || // html always processed by SW
            !req.response() ||
            !req.response().fromServiceWorker()
        ),
      'all non-cacheable resources are not fetched from service worker'
    );

    await browser.close();
  } finally {
    proc.kill();
    t.end();
  }
});

test('/works offline', async t => {
  const hostname = 'http://localhost:';
  const {port, proc} = await startServer();
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-features=NetworkService',
    ],
    ignoreHTTPSErrors: true,
  });
  try {
    let isReady, controller;
    const page = await browser.newPage();
    page.on('console', msg => {
      if (msg._text.startsWith('[TEST] cached after first load:')) {
        const cacheKeys = msg._text.split('#')[1].split(',');
        t.ok(
          cacheKeys.length === precachePaths.length,
          'first page load: only precachePaths cached'
        );
        t.ok(
          precachePaths.every(path =>
            cacheKeys.includes(`${hostname}${port}${path}`)
          ),
          'first page load: cache names are same as precachePaths'
        );
        t.ok(
          !cacheKeys.includes(`${hostname}${port}/`),
          'first page load: html not cached'
        );
      } else if (msg._text.startsWith('[TEST] cached after offline load:')) {
        const cacheKeys = msg._text.split('#')[1].split(',');
        t.ok(
          cacheKeys.length === cacheablePaths.length + 1, // add one for HTML
          'second page load: all cacheable resources cached'
        );
        t.ok(
          cacheablePaths.every(path =>
            cacheKeys.includes(`${hostname}${port}${path}`)
          ),
          'second page load: cached resources are same as cacheablePath names'
        );
        t.ok(
          cacheKeys.includes(`${hostname}${port}/`),
          'second page load: cached resources includes html path'
        );
      }
    });

    // FIRST LOAD
    await page.goto(`${hostname}${port}`);

    isReady = await page.evaluate('navigator.serviceWorker.ready');
    t.ok(isReady, 'service worker is active');

    controller = await page.evaluate('navigator.serviceWorker.controller');
    t.notOk(
      controller,
      'first page load: page did not have existing service worker'
    );

    await logCachedURLs(page, '[TEST] cached after first load:');

    // Capture requests during 2nd load.
    const allRequests = new Map();

    page.on('request', req => {
      allRequests.set(req.url(), req);
    });

    // go offline
    await page.setOfflineMode(true);

    // OFFLINE LOAD
    await page.reload({waitUntil: 'domcontentloaded'});
    controller = await page.evaluate('navigator.serviceWorker.controller');
    t.ok(
      controller,
      'offline page load: page has an existing active service worker'
    );

    await logCachedURLs(page, '[TEST] cached after offline load:');

    t.ok(
      Array.from(allRequests.values())
        .filter(req =>
          cacheablePaths.find(
            path =>
              `${hostname}${port}${path}` === req.url() ||
              req.url() === `${hostname}${port}/` // html
          )
        )
        .every(req => req.response() && req.response().fromServiceWorker()),
      'all cacheable resources are fetched from service worker'
    );

    t.ok(
      Array.from(allRequests.values())
        .filter(
          req =>
            !cacheablePaths.find(
              path => `${hostname}${port}${path}` === req.url()
            )
        )
        .every(
          req =>
            req.resourceType() === 'document' || // html always processed by SW
            !req.response() ||
            !req.response().fromServiceWorker()
        ),
      'all non-cacheable resources are not fetched from service worker'
    );

    await browser.close();
  } finally {
    proc.kill();
    t.end();
  }
});

test('/response to redirect', async t => {
  const hostname = 'http://localhost:';
  const {port, proc} = await startServer();
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-features=NetworkService',
    ],
    ignoreHTTPSErrors: true,
  });
  try {
    let isReady, controller;
    const page = await browser.newPage();
    page.on('console', msg => {
      if (msg._text.startsWith('[TEST] cached after redirect:')) {
        const cacheKeys = msg._text.split('#')[1].split(',');
        t.ok(
          cacheKeys.length === cacheablePaths.length + 1, // add one for HTML
          'page load after redirect: all cacheable resources cached'
        );
        t.ok(
          cacheablePaths.every(path =>
            cacheKeys.includes(`${hostname}${port}${path}`)
          ),
          'page load after redirect: cached resources are same as cacheablePath names'
        );
        t.ok(
          cacheKeys.includes(`${hostname}${port}/redirected`) &&
            !cacheKeys.includes(`${hostname}${port}/redirect`),
          'page load after redirect: cached resources includes `redirected` but not `redirect`'
        );
      }
    });

    // 1. FIRST LOAD
    await page.goto(`${hostname}${port}`);

    isReady = await page.evaluate('navigator.serviceWorker.ready');
    t.ok(isReady, 'service worker is active');

    controller = await page.evaluate('navigator.serviceWorker.controller');
    t.notOk(
      controller,
      'first page load: page did not have existing service worker'
    );

    // Capture requests during next load.
    const allRequests = new Map();

    page.on('request', req => {
      allRequests.set(req.url(), req);
    });

    // 2. TRIGGER REDIRECT
    await page.goto(`${hostname}${port}/redirect`);

    controller = await page.evaluate('navigator.serviceWorker.controller');
    t.ok(
      controller,
      'second page load: page has an existing active service worker'
    );

    await logCachedURLs(page, '[TEST] cached after redirect:');

    t.ok(
      Array.from(allRequests.values())
        .filter(req =>
          cacheablePaths.find(
            path =>
              `${hostname}${port}${path}` === req.url() ||
              req.url() === `${hostname}${port}/redirected` // html
          )
        )
        .every(req => req.response() && req.response().fromServiceWorker()),
      'all cacheable resources are fetched from service worker'
    );

    t.ok(
      Array.from(allRequests.values())
        .filter(
          req =>
            !cacheablePaths.find(
              path => `${hostname}${port}${path}` === req.url()
            )
        )
        .every(
          req =>
            req.resourceType() === 'document' || // documents always handled by service worker
            !req.response() ||
            !req.response().fromServiceWorker()
        ),
      'all non-cacheable resources are not fetched from service worker'
    );

    await browser.close();
  } finally {
    proc.kill();
    t.end();
  }
});

test('/response to error', async t => {
  const hostname = 'http://localhost:';
  const {port, proc} = await startServer();
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-features=NetworkService',
    ],
    ignoreHTTPSErrors: true,
  });
  try {
    let isReady, controller;
    const page = await browser.newPage();
    page.on('console', msg => {
      if (msg._text.startsWith('[TEST] cached after first load:')) {
        const cacheKeys = msg._text.split('#')[1].split(',');
        t.ok(
          cacheKeys.length === precachePaths.length,
          'first page load: only precachePaths cached'
        );
        t.ok(
          precachePaths.every(path =>
            cacheKeys.includes(`${hostname}${port}${path}`)
          ),
          'first page load: cache names are same as precachePaths'
        );
        t.ok(
          !cacheKeys.includes(`${hostname}${port}/`),
          'first page load: html not cached'
        );
      } else if (
        msg._text.startsWith('[TEST] cached after second good load:')
      ) {
        const cacheKeys = msg._text.split('#')[1].split(',');
        t.ok(
          cacheKeys.length === cacheablePaths.length + 1, // add one for HTML
          'second good page load: all cacheable resources cached'
        );
        t.ok(
          cacheablePaths.every(path =>
            cacheKeys.includes(`${hostname}${port}${path}`)
          ),
          'second good page load: cached resources are same as cacheablePath names'
        );
        t.ok(
          cacheKeys.includes(`${hostname}${port}/`),
          'second good page load: cached resources includes html path'
        );
      } else if (msg._text.startsWith('[TEST] cached after error')) {
        t.ok(
          msg._text.split('#')[1].trim().length === 0,
          'page load after error: all cached naviagtion request cleared cleared'
        );
      }
    });

    // 1. FIRST LOAD
    await page.goto(`${hostname}${port}`);

    isReady = await page.evaluate('navigator.serviceWorker.ready');
    t.ok(isReady, 'service worker is active');

    controller = await page.evaluate('navigator.serviceWorker.controller');
    t.notOk(
      controller,
      'first page load: page did not have existing service worker'
    );

    await logCachedURLs(page, '[TEST] cached after first load:');

    // Capture requests during next load.
    const allRequests = new Map();

    page.on('request', req => {
      allRequests.set(req.url(), req);
    });

    // 2. TRIGGER 500 BUT WITH GOOD HTML
    await page.goto(`${hostname}${port}/error-500`);

    controller = await page.evaluate('navigator.serviceWorker.controller');
    t.ok(
      controller,
      'repeat page load: page has an existing active service worker'
    );

    await logCachedHTMLRequests(
      page,
      `[TEST] cached after error (500 BUT WITH GOOD HTML):`
    );

    // 3. RELOAD A GOOD PAGE
    await page.goto(`${hostname}${port}`);
    controller = await page.evaluate('navigator.serviceWorker.controller');
    t.ok(
      controller,
      'repeat page load: page has an existing active service worker'
    );

    await logCachedURLs(page, '[TEST] cached after second good load:');

    // 4. TRIGGER 200 WITH BAD HTML
    await page.goto(`${hostname}${port}/error-200`);

    controller = await page.evaluate('navigator.serviceWorker.controller');
    t.ok(
      controller,
      'repeat page load: page has an existing active service worker'
    );

    await logCachedHTMLRequests(
      page,
      `[TEST] cached after error (200 WITH BAD HTML):`
    );

    await browser.close();
  } finally {
    proc.kill();
    t.end();
  }
});

async function logCachedURLs(page, label) {
  await page.evaluate(
    label =>
      window.caches
        .open('0.0.0')
        .then(cache => cache.keys())
        .then(keys =>
          console.log(
            `${label}#${keys
              .map(key => key.url)
              .filter(Boolean)
              .join(',')}`
          )
        ),
    label
  );
}

async function logCachedHTMLRequests(page, label) {
  await page.evaluate(
    label =>
      window.caches
        .open('0.0.0')
        .then(cache => cache.keys())
        .then(keys =>
          console.log(
            `${label}#${keys
              .filter(key => key.mode === 'navigate')
              .map(key => key.url)
              .join(',')}`
          )
        ),
    label
  );
}

async function logCacheDates(page, label) {
  await page.evaluate(async label => {
    const cache = await window.caches.open('0.0.0');
    const requests = await cache.keys();
    const responses = await Promise.all(
      requests.map(request => cache.match(request))
    );
    console.log(
      `${label}#${responses.map(res =>
        new Date(res.headers.get('date')).getTime()
      )}`
    );
  }, label);
}
