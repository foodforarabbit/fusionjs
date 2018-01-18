const test = require('tape');

const fusionPluginHeatpipePerformanceLogger = require('../');

test('fusionPluginHeatpipePerformanceLogger', function t(assert) {
  assert.ok(typeof fusionPluginHeatpipePerformanceLogger === 'function',
    'exported correctly');

  assert.end();
});
