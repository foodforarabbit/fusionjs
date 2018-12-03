const {join, resolve, dirname, relative} = require('path');
const {withJsFile, findFiles, step} = require('@dubstep/core');

module.exports = step('mod-fix-test-imports', async () => {
  const files = await findFiles('src/__tests__/**/*.js');
  await Promise.all(
    files.map(fileName =>
      withJsFile(fileName, path => {
        path.traverse({
          ImportDeclaration(ipath, state) {
            if (!ipath.node.source.value.startsWith('.')) {
              return;
            }
            const resolvedPath = resolve(
              dirname(fileName),
              ipath.node.source.value
            );
            if (!resolvedPath.includes('src/__tests__')) {
              return;
            }
            const destPath = join(
              'src/test-utils',
              resolvedPath.split('src/__tests__')[1]
            );
            if (!checkImport(resolvedPath)) {
              ipath.node.source.value = relative(dirname(fileName), destPath);
            }
          },
        });
      })
    )
  );
});

function checkImport(f) {
  try {
    require.resolve(f);
    return true;
  } catch (e) {
    return false;
  }
}
