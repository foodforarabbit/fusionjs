// @flow
import {types as t} from '@babel/core';
import {withJsFiles} from '../../utils/with-js-files.js';
import log from '../../utils/log.js';
import {getLatestVersion} from '../../utils/get-latest-version.js';
import type {UpgradeStrategy} from '../../types.js';
import {withJsonFile, ensureJsImports} from '@dubstep/core';

type ReplaceOptions = {
  target: string,
  replacement: string,
  imports?: Array<string>,
  typeImports?: Array<string>,
  dir: string,
  strategy: UpgradeStrategy,
};
export const replacePackageImports = async ({
  target,
  replacement,
  imports = [],
  typeImports = [],
  dir,
  strategy,
}: ReplaceOptions) => {
  let encounteredOtherImports = false;
  await withJsFiles(dir, path => {
    path.traverse({
      ImportDeclaration(ipath) {
        if (ipath.node.source.value === target) {
          const targetImports = new Map();
          const targetImportTypes = new Map();
          ipath.node.specifiers.forEach(specifier => {
            const map = isTypeImport(ipath, specifier)
              ? targetImportTypes
              : targetImports;
            map.set(getImportIdentifier(specifier), specifier.local.name);
          });
          const replaceAllTargetImports = [...targetImports.keys()].every(
            targetImport => imports.includes(targetImport)
          );
          const replaceAllTargetTypeImports = [
            ...targetImportTypes.keys(),
          ].every(targetImport => typeImports.includes(targetImport));
          if (replaceAllTargetImports && replaceAllTargetTypeImports) {
            // Replace package name since all imports are in the replacement package
            ipath.node.source = t.stringLiteral(replacement);
          } else {
            encounteredOtherImports = true;
            ipath.node.specifiers = ipath.node.specifiers.filter(specifier => {
              // Filter out target imports that we will replace
              const importIdentifier = getImportIdentifier(specifier);
              const importList = isTypeImport(ipath, specifier)
                ? typeImports
                : imports;
              return !importList.includes(importIdentifier);
            });
            const replacementImportString = getImportString(
              ipath,
              targetImports,
              imports
            );
            if (replacementImportString) {
              ensureJsImports(
                path,
                `import ${replacementImportString} from "${replacement}";`
              );
            }
            const replacementTypeImportString = getImportString(
              ipath,
              targetImportTypes,
              typeImports
            );
            if (replacementTypeImportString) {
              ensureJsImports(
                path,
                `import type ${replacementTypeImportString} from "${replacement}";`
              );
            }
          }
        }
      },
    });
  });

  await withJsonFile(`${dir}/package.json`, async pkg => {
    const isDep = pkg.dependencies && pkg.dependencies[target];
    const isDevDep = pkg.devDependencies && pkg.devDependencies[target];
    // ensure replacement dep is in whatever group the target dep was
    if (isDep) {
      await ensure(pkg, 'dependencies', replacement, strategy);
    }
    if (isDevDep) {
      await ensure(pkg, 'devDependencies', replacement, strategy);
    }
    if (!encounteredOtherImports) {
      // no longer used - remove old package
      await remove(pkg, 'dependencies', target);
      await remove(pkg, 'devDependencies', target);
    }
  });
};

function isTypeImport(path, specifier) {
  return path.node.importKind === 'type' || specifier.importKind === 'type';
}

function getImportIdentifier(specifier) {
  return t.isImportDefaultSpecifier(specifier)
    ? 'default'
    : specifier.imported.name;
}

function getImportString(
  ipath,
  targetImports = new Map(),
  importsToReplace = []
) {
  const replacementImports = [];
  if (importsToReplace.includes('default') && targetImports.has('default')) {
    // import DefaultExport from 'target';
    replacementImports.push(targetImports.get('default'));
  }
  const namedReplacementImports = importsToReplace.reduce((acc, name) => {
    if (targetImports.has(name) && name !== 'default') {
      const localName = targetImports.get(name);
      if (name !== localName) {
        // import {NamedExport as LocalName} from 'target';
        // $FlowFixMe
        acc.push(`${name} as ${localName}`);
      } else {
        // import {NamedExport} from 'target';
        acc.push(localName);
      }
    }
    return acc;
  }, []);
  if (namedReplacementImports.length) {
    replacementImports.push(`{ ${namedReplacementImports.join(', ')} }`);
  }
  if (replacementImports.length) {
    // format: `DefaultExport, {NamedExport, OtherNamedExport}`
    return replacementImports.join(', ');
  } else {
    return null;
  }
}

async function remove(pkg, group, packageName) {
  if (pkg[group] && pkg[group][packageName]) {
    log.title(`Removing ${packageName}`);
    delete pkg[group][packageName];
  }
}

async function ensure(pkg, group, packageName, strategy) {
  if (strategy === 'curated') strategy = 'latest';
  pkg[group] = pkg[group] || {};
  log.title(`Adding ${packageName}`);
  pkg[group][packageName] = await getLatestVersion(packageName, strategy);
}
