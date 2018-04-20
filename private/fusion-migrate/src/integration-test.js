const path = require('path');
const execa = require('execa');
const tmp = require('tmp');

const remote = 'gitolite@code.uber.internal:web/example-trips-viewer';

async function run() {
  const dir = tmp.dirSync().name;
  const tripsViewerDir = path.join(dir, 'example-trips-viewer');
  const fusionMigrateDir = path.join(__dirname, '../bin/fusion-migrate.js');
  await execa.shell(`git clone ${remote}`, {cwd: dir, stdio: 'inherit'});
  await execa.shell(`git fetch -a`, {cwd: tripsViewerDir, stdio: 'inherit'});
  await execa.shell(`node ${fusionMigrateDir} migrate`, {
    cwd: tripsViewerDir,
    stdio: 'inherit',
  });
  await execa.shell(`yarn dev`, {cwd: tripsViewerDir, stdio: 'inherit'});
}

run();
