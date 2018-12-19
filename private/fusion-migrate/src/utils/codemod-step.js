const babel = require('@babel/core');
const {withJsFile, findFiles} = require('@dubstep/core');
const {join} = require('path');

module.exports = async function codemodStep({
  destDir,
  glob = 'src/**/*.js',
  plugin,
  plugins,
}) {
  if (!plugins) {
    plugins = [plugin];
  }

  const files = await findFiles(glob);
  for (const file of files) {
    await withJsFile(file, path => {
      let state = {
        file: {
          opts: {
            filename: join(destDir, file),
          },
        },
      };
      plugins.forEach(plugin => {
        path.traverse(plugin(babel).visitor, state);
      });
    });
  }
};
