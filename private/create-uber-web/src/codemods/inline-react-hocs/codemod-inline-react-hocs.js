// @flow
import {withJsFiles} from '../../utils/with-js-files.js';
import {ensureJsImports} from '@dubstep/core';
import path from 'path';
import util from 'util';
import fs from 'fs';

const mkdir = util.promisify(fs.mkdir);
const copyFile = util.promisify(fs.copyFile);

// $FlowFixMe - bad flow definition regarding 2nd parameter
const mkdirp = filePath => mkdir(filePath, {recursive: true});

// Map a package import to an HOC
const packageMap = {
  '@uber/fusion-plugin-google-analytics-react': 'withGoogleAnalytics',
  '@uber/fusion-plugin-logtron-react': 'withLogger',
  '@uber/fusion-plugin-m3-react': 'withM3',
  '@uber/fusion-plugin-tealium-react': 'withTealium',
  'fusion-plugin-universal-events-react': 'withBatchEvents',
};

// Map HOC to filename (in ./templates and in user's repository)
const hocMap = {
  withGoogleAnalytics: 'with-google-analytics.js',
  withLogger: 'with-logger.js',
  withM3: 'with-m3.js',
  withTealium: 'with-tealium.js',
  withBatchEvents: 'with-batch-events.js',
};

export const inlineReactHocs = async ({dir}: {dir: string}) => {
  let absHocPaths = {};
  await withJsFiles(dir, (babelPath, filePath) => {
    babelPath.traverse({
      ImportDeclaration(ipath) {
        const pkg = ipath.node.source.value;
        if (pkg in packageMap) {
          const hocName = packageMap[pkg];
          let foundHocImport = false;
          ipath.node.specifiers = ipath.node.specifiers.filter(sp => {
            if (sp.imported && sp.imported.name === hocName) {
              foundHocImport = true;
              return false;
            }
            return true;
          });
          if (ipath.node.specifiers.length === 0) {
            ipath.remove();
          }
          if (foundHocImport) {
            const hocFileName = hocMap[hocName];
            // get path of current file
            const absPath = path.resolve(filePath);
            // decide where to write the local hoc
            let absHocPath = absHocPaths[hocFileName];
            if (!absHocPath) {
              // find `src` path
              const srcPath = absPath.slice(0, absPath.indexOf('/src/') + 5);
              absHocPath = path.join(srcPath, `components/hocs/${hocFileName}`);
              absHocPaths[hocFileName] = absHocPath;
            }
            // decide how to relatively reference the hoc path
            let relativeHocPath = path.relative(
              path.dirname(absPath),
              absHocPath
            );
            if (!relativeHocPath.startsWith('..')) {
              relativeHocPath = `./${relativeHocPath}`;
            }
            ensureJsImports(
              babelPath,
              `import {${hocName}} from "${relativeHocPath}";`
            );
          }
        }
      },
    });
  });
  const hocFileNames = Object.keys(absHocPaths);
  if (hocFileNames.length) {
    await mkdirp(path.dirname(absHocPaths[hocFileNames[0]]));
    await Promise.all(
      hocFileNames.map(async hocFileName => {
        const templatePath = path
          .resolve(__dirname, `./templates/${hocFileName}`)
          .replace('/dist/', '/src/');
        await copyFile(templatePath, absHocPaths[hocFileName]);
      })
    );
  }
};
