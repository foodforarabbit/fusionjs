// @flow
import {withJsFiles, visitJsImport} from '@dubstep/core';
import hasRegistrationUsage from '../utils/has-registration-usage.js';

type options = {
  dir: string,
};

export const codemodFusionPluginLogtron = async ({dir}: options) => {
  await withJsFiles(`${dir}/**/*.js`, async path => {
    visitJsImport(
      path,
      `import LoggerPlugin from '@uber/fusion-plugin-logtron'`,
      (importPath, refs) => {
        const teamTokenSpecifier = importPath.node.specifiers.find(spec => {
          return (
            spec.type === 'ImportSpecifier' &&
            spec.imported.name === 'LogtronTeamToken'
          );
        });
        if (!teamTokenSpecifier) {
          return;
        }
        const localName = teamTokenSpecifier.local.name;

        if (hasRegistrationUsage(path, localName)) {
          let teamTokenBinding = importPath.scope.getBinding(localName);
          teamTokenBinding &&
            teamTokenBinding.referencePaths.forEach(usagePath => {
              usagePath.parentPath.remove();
            });
        }
        importPath.node.specifiers = importPath.node.specifiers.filter(spec => {
          return (
            spec.type !== 'ImportSpecifier' ||
            spec.imported.name !== 'LogtronTeamToken'
          );
        });
      }
    );
  });
};
