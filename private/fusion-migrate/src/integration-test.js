const migrate = require('./migrate.js');
const execa = require('execa');
const tmp = require('tmp');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

tmp.setGracefulCleanup();
(async () => {
  const dir = tmp.dirSync().name;
  await execa.shell(
    `git clone gitolite@code.uber.internal:web/example-trips-viewer`,
    {cwd: dir}
  );
  const destDir = path.join(dir, 'example-trips-viewer');
  let report = {};
  const reportPath = path.join(destDir, 'migration-report.json');
  await migrate('', '', {dir: destDir, steps: [], skipSteps: []});
  report = JSON.parse(fs.readFileSync(reportPath).toString());
  assert.equal(report.lastCompletedStep, 'engines');
  await migrate('', '', {dir: destDir, steps: [], skipSteps: []});
  report = JSON.parse(fs.readFileSync(reportPath).toString());
  assert.equal(report.lastCompletedStep, 'lint');
  await migrate('', '', {dir: destDir, steps: [], skipSteps: []});
  report = JSON.parse(fs.readFileSync(reportPath).toString());
  assert.equal(report.lastCompletedStep, 'test');
  await migrate('', '', {dir: destDir, steps: [], skipSteps: []});
  assert.equal(fs.existsSync(reportPath), false);
})();
