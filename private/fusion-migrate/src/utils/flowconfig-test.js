const genericTest = require('./generic-test.js');

module.exports = function test(fixtureDir, plugin) {
  const filename = '.flowconfig';
  const pluginName = plugin().name;
  const transform = content =>
    plugin()
      .transform(content.split('\n'))
      .join('\n');
  genericTest(fixtureDir, pluginName, filename, transform);
};
