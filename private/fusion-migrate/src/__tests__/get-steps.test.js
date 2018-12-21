const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const format = require('../utils/codemod-test.js').format;
const getSteps = require('../get-steps.js');
const parserOpts = require('../parser-opts.js');
const modDataDependency = require('../codemods/data-dependency/plugin.js');
const modRedirect = require('../codemods/mod-redirect/plugin.js');
const modReactRouter = require('../codemods/mod-react-router-4/plugin.js');
const modIndexRedirect = require('../codemods/mod-index-redirect/plugin.js');
const modIndexRoute = require('../codemods/mod-index-route/plugin.js');
const modHoistRoutes = require('../codemods/hoist-routes/plugin.js');
const modReplaceRouterImports = require('../codemods/replace-react-router-imports/plugin.js');

test('getSteps 14', async () => {
  const steps = getSteps({version: 14});
  expect(Array.isArray(steps)).toEqual(true);
  steps.forEach(s => {
    if (s.id) {
      expect(typeof s.id).toEqual('string');
    } else {
      expect(typeof s.name).toEqual('string');
    }
    expect(typeof s.step).toEqual('function');
  });
  expect(steps.length).toBeGreaterThan(0);
});

test('getSteps 13', async () => {
  const steps = getSteps({version: 13});
  expect(Array.isArray(steps)).toEqual(true);
  steps.forEach(s => {
    if (s.id) {
      expect(typeof s.id).toEqual('string');
    } else {
      expect(typeof s.name).toEqual('string');
    }
    expect(typeof s.step).toEqual('function');
  });
  expect(steps.length).toBeGreaterThan(0);
});

const expectedRoutingSteps = {
  'mod-data-dependency': modDataDependency,
  'mod-redirect': modRedirect,
  'mod-index-redirect': modIndexRedirect,
  'mod-index-route': modIndexRoute,
  'mod-react-router': modReactRouter,
  'mod-hoist-routes': modHoistRoutes(),
  'mod-replace-router-imports': modReplaceRouterImports,
};
test('routing steps are run in correct order', async () => {
  const expectedRoutingIds = Object.keys(expectedRoutingSteps);
  const steps = getSteps({version: 14})
    .map(s => s.id)
    .filter(s => {
      return expectedRoutingIds.includes(s);
    });
  expect(steps).toEqual(expectedRoutingIds);
});

test('routing codemods', async () => {
  const contents = fs
    .readFileSync(
      path.join(__dirname, '../__fixtures__/routes-fixture/src/routes.js')
    )
    .toString();
  let transformed = contents;
  Object.values(expectedRoutingSteps).forEach(mod => {
    transformed = babel.transform(transformed, {
      plugins: [mod],
      filename: 'any.js',
      parserOpts,
    }).code;
  });
  transformed = format(transformed);
  expect(transformed).toMatchSnapshot();
});
