const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = () => {
  const visitor = visitNamedModule({
    packageName: [
      'fusion-plugin-i18n-react',
      'fusion-plugin-i18n',
      '@uber/fusion-plugin-rosetta',
    ],
    refsHandler: (t, state, refPaths, path) => {
      refPaths.forEach(ref => {
        let parent = ref.parentPath;
        while (parent && parent.type !== 'BlockStatement') {
          ref = ref.parentPath;
          parent = ref.parentPath;
        }
        if (parent) {
          ref.remove();
        }
      });
    },
  });

  return {
    name: 'remove-i18n-plugins',
    visitor,
  };
};
