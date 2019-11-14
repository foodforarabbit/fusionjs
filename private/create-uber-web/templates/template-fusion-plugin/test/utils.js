// @noflow
/* eslint-env node, browser */

exports.untilReady = async function untilReady(page, port) {
  let started = false;
  let numTries = 0;
  while (!started && numTries < 10) {
    try {
      await page.goto(`http://localhost:${port}`);
      started = true;
    } catch (e) {
      numTries++;
      await new Promise(resolve => {
        setTimeout(resolve, Math.pow(2, numTries));
      });
    }
  }

  if (!started) {
    throw new Error('Failed to start');
  }
};
