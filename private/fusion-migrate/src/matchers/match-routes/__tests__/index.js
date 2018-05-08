const path = require('path');
const matcherTest = require('../../../utils/matcher-test.js');
const plugin = require('../match-routes.js');

const fixtureDir = path.join(__dirname, '../__fixtures__');

test('match-routes unwrapped', async () => {
  const state = await matcherTest(
    path.join(fixtureDir, 'unwrapped/code.js'),
    plugin
  );
  expect(state.routesFile).toMatch('unwrapped/code.js');
});

test('match-routes wrapped', async () => {
  const state = await matcherTest(
    path.join(fixtureDir, 'wrapped/code.js'),
    plugin
  );
  expect(state.routesFile).toMatch('wrapped/code.js');
});

test('match-routes wrapped-arrow', async () => {
  const state = await matcherTest(
    path.join(fixtureDir, 'wrapped-arrow/code.js'),
    plugin
  );
  expect(state.routesFile).toMatch('wrapped-arrow/code.js');
});
