const fs = require('fs');
const path = require('path');

module.exports = function updateGitignore({destDir}) {
  const filePath = path.join(destDir, '.gitignore');
  const currentFile = fs.readFileSync(filePath).toString();
  fs.writeFileSync(filePath, currentFile + '\n.fusion/\n');
};
