/* globals describe, it */
const {promisify} = require('util');
const fs = require('fs');
const path = require('path');

const readFile = promisify(fs.readFile);

module.exports = function test(
  fixtureDir,
  pluginName,
  filename,
  transform,
  formatter // optional
) {
  if (!formatter) {
    formatter = text => text;
  }

  const tests = fs.readdirSync(path.join(fixtureDir)).map(fixture => {
    return {
      fixture: path.join(fixtureDir, fixture, filename),
    };
  });

  pluginTester({
    pluginName,
    tests,
    transform,
    formatter,
  });
};

const separator = '\n\n      ↓ ↓ ↓ ↓ ↓ ↓\n\n';

function pluginTester({pluginName, tests, transform, formatter}) {
  // eslint-disable-next-line jest/valid-describe
  describe(pluginName, () => {
    tests.forEach(test => {
      const fixtureName = path.basename(path.dirname(test.fixture));
      it(fixtureName, async () => {
        const fileContents = (await readFile(test.fixture)).toString();
        const transformedContents = transform(fileContents, test);
        expect(
          formatter(fileContents) + separator + formatter(transformedContents)
        ).toMatchSnapshot(fixtureName);
      });
    });
  });
}
