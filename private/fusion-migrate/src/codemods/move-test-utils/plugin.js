const {dirname, relative} = require('path');

module.exports = () => {
  return {
    name: 'move-test-utils',
    visitor: {
      ImportDeclaration(path, state) {
        if (path.node.source.value.includes('/util')) {
          const filename = state.file.opts.filename;
          const from = dirname(filename);
          const parts = from.split('/');
          const dirs = path.node.source.value.split('/');
          while (dirs[0] === '..') {
            dirs.shift();
            parts.pop();
          }
          const to = [...parts, ...dirs]
            .join('/')
            .replace('src/test', 'src/test-utils');
          path.node.source.value = relative(from, to);
        }
      },
    },
  };
};
