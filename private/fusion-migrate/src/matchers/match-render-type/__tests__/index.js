const path = require('path');
const matcherTest = require('../../../utils/matcher-test.js');
const plugin = require('../match-render-type.js');

const fixtureDir = path.join(__dirname, '../__fixtures__');

test('match-render-type isorender', async () => {
  const state = await matcherTest(
    path.join(fixtureDir, 'isorender/code.js'),
    plugin
  );
  expect(state.renderType).toEqual('isorender');
});

test('match-render-type page-skeleton', async () => {
  const state = await matcherTest(
    path.join(fixtureDir, 'page-skeleton/code.js'),
    plugin
  );
  expect(state.renderType).toEqual('renderPageSkeleton');
  expect(state.pageSkeletonConfig.type).toEqual('ObjectExpression');
});
