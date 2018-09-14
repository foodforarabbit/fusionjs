const proc = require('child_process');

module.exports = () => {
  proc.execSync(`
    git clean -xdf;
    git reset --hard;
    git checkout master;
    git branch -D fusion-migration;
    git checkout -b fusion-migration;
    echo "You're on the fusion-migration branch now";
  `);
};
