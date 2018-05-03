const {matchStatement} = require('../../utils');

module.exports = () => ({
  name: 'plugin-removals',
  visitor: {
    ImportDeclaration(path) {
      remove(path, `import FaviconPlugin from './plugins/favicon.js'`);
      remove(path, `import CssResetPlugin from './plugins/css-reset.js'`);
      remove(path, `import FullHeightPlugin from './plugins/full-height.js'`);
    },
    ExpressionStatement(path) {
      remove(path, `app.middleware(FaviconPlugin)`);
      remove(path, `app.middleware(CssResetPlugin)`);
      remove(path, `app.middleware(FullHeightPlugin)`);
    },
  },
});
function remove(path, code) {
  if (path && path.node && matchStatement(path, code, {shallow: true})) {
    path.remove();
  }
}
