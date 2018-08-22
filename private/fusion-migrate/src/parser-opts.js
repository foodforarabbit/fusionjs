module.exports = {
  sourceType: 'module',
  plugins: [
    'jsx',
    'flow',
    'classProperties',
    'objectRestSpread',
    ['decorators', {decoratorsBeforeExport: false}],
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
  ],
};
