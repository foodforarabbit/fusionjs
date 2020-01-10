// @flow
import path from 'path';
import util from 'util';
import fs from 'fs';
import log from '../../utils/log.js';
import type {UpgradeStrategy} from '../../types.js';
import {withJsFiles} from '../../utils/with-js-files.js';
import {withJsonFile, ensureJsImports} from '@dubstep/core';
import {getLatestVersion} from '../../utils/get-latest-version.js';

const mkdir = util.promisify(fs.mkdir);
const copyFile = util.promisify(fs.copyFile);

// $FlowFixMe - bad flow definition regarding 2nd parameter
const mkdirp = filePath => mkdir(filePath, {recursive: true});

// Map a package import to:
// - HOC import
// - HOC filename (in ./templates and in user's repository)
// - package name to install
type PackageConfig = {
  [string]: {
    hocName: string,
    hocFileName: string,
    replacementPackage: string,
  },
};

const packageMap: PackageConfig = {
  '@uber/fusion-plugin-google-analytics-react': {
    hocName: 'withGoogleAnalytics',
    hocFileName: 'with-google-analytics.js',
    replacementPackage: '@uber/fusion-plugin-google-analytics',
  },
  '@uber/fusion-plugin-logtron-react': {
    hocName: 'withLogger',
    hocFileName: 'with-logger.js',
    replacementPackage: '@uber/fusion-plugin-logtron',
  },
  '@uber/fusion-plugin-m3-react': {
    hocName: 'withM3',
    hocFileName: 'with-m3.js',
    replacementPackage: '@uber/fusion-plugin-m3',
  },
  '@uber/fusion-plugin-tealium-react': {
    hocName: 'withTealium',
    hocFileName: 'with-tealium.js',
    replacementPackage: '@uber/fusion-plugin-tealium',
  },
  'fusion-plugin-universal-events-react': {
    hocName: 'withBatchEvents',
    hocFileName: 'with-batch-events.js',
    replacementPackage: 'fusion-plugin-universal-events',
  },
};

export const inlineReactHocs = async ({
  dir,
  strategy,
}: {
  dir: string,
  strategy: UpgradeStrategy,
}) => {
  let absHocPaths = {};
  const encounteredOtherImports = new Set();
  await withJsFiles(dir, (babelPath, filePath) => {
    babelPath.traverse({
      ImportDeclaration(ipath) {
        const pkg = ipath.node.source.value;
        if (packageMap[pkg]) {
          const {hocName} = packageMap[pkg];
          let foundHocImport = false;
          ipath.node.specifiers = ipath.node.specifiers.filter(sp => {
            if (sp.imported && sp.imported.name === hocName) {
              foundHocImport = true;
              return false;
            } else {
              // Non-HOC import
              encounteredOtherImports.add(pkg);
              return true;
            }
          });
          if (ipath.node.specifiers.length === 0) {
            ipath.remove();
          }
          if (foundHocImport) {
            const {hocFileName} = packageMap[pkg];
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

  async function replace(pkg, group, packageName, replacementPackageName) {
    if (pkg[group] && pkg[group][packageName]) {
      log.title(`Replacing ${packageName} with ${replacementPackageName}`);
      delete pkg[group][packageName];
      pkg[group][replacementPackageName] = await getLatestVersion(
        replacementPackageName,
        strategy
      );
    }
  }

  const targetPackages = new Set(Object.keys(packageMap));
  await withJsonFile(`${dir}/package.json`, async pkg => {
    for (const target of targetPackages) {
      const {replacementPackage} = packageMap[target];
      if (encounteredOtherImports.has(target)) {
        log.title(`Adding ${replacementPackage}`);
        // need both packages
        const latestVersion = await getLatestVersion(
          replacementPackage,
          strategy
        );
        if (pkg.dependencies && pkg.dependencies[target]) {
          pkg.dependencies[replacementPackage] = latestVersion;
        }
        if (pkg.devDependencies && pkg.devDependencies[target]) {
          pkg.devDependencies[replacementPackage] = latestVersion;
        }
      } else {
        // replace old with new package
        await replace(pkg, 'dependencies', target, replacementPackage);
        await replace(pkg, 'devDependencies', target, replacementPackage);
      }
    }
  });
};
