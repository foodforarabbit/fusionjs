const util = require('util');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const ncp = require('ncp');

const codemodStep = require('./utils/codemod-step.js');

const replaceImport = require('./utils/replace-import.js');
const log = require('./log.js');

const destDir = process.cwd();

async function updateFonts() {
  try {
    // clear old font files
    await util.promisify(rimraf)('src/static/fonts');
    // copy new files
    await ncp(path.resolve(__dirname, './resources/font-files'), 'src/static/fonts');
    // copy new config
    await util.promisify(fs.copyFile)(path.resolve(__dirname, './resources/font-config.js'), 'src/config/fonts.js');
  } catch(e) {
    return log('font update failed:', e);
  }
  await updateImports(
    `import {withBook} from ''`,
    `import {withMoveRegular} from ''`,
    'src/config/fonts'
  );
  await updateImports(
    `import {withNews} from ''`,
    `import {withMoveBold} from ''`,
    'src/config/fonts'
  );
  await updateImports(
    `import {withThin} from ''`,
    `import {withMoveLight} from ''`,
    'src/config/fonts'
  );
}

module.exports = updateFonts;

async function updateImports(from, to, localSourcePath) {
  await codemodStep({
    destDir,
    plugin: {
      visitor: replaceImport(from, to, localSourcePath),
    },
    filter: () => true,
  }).catch(e => log('font update failed:', e));
}
