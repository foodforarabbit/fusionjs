module.exports = {
  assumeNoImportSideEffects: true,
  experimentalTransformTest: (request, defaults) => {
    if (request.includes('node_modules')) {
      return defaults;
    }
    return 'all';
  },
  experimentalBundleTest: (request, defaults) => {
    if (request.includes('node_modules')) {
      return defaults;
    }
    return 'universal';
  },
  babel: {
    plugins: ['@babel/plugin-proposal-optional-chaining'],
  },
  jest: {
    // don't transform any third party modules except fusion-cli
    transformIgnorePatterns: [
      '.*/node_modules/(?!(fusion-cli*|@uber/graphql-plugin-*))',
    ],
  },
};
