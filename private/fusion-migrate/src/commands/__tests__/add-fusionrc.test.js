const addFusionRC = require('../add-fusionrc.js');

jest.mock('fs', () => {
  const files = [
    JSON.stringify({
      dependencies: {
        'babel-eslint': '0',
        'babel-plugin-module-resolver': '0',
        'babel-plugin-something': '0',
        '@babel/core': '0',
      },
      devDependencies: {
        'babel-eslint': '0',
        'babel-plugin-module-resolver': '0',
        'babel-plugin-something': '0',
        '@babel/core': '0',
      },
    }),
    JSON.stringify({
      extends: ['something'],
      plugins: [['module-resolver', {}], 'asdf'],
      presets: ['preset-react'],
    }),
  ];
  return {
    readFileSync(dir) {
      return files.shift();
    },
    existsSync() {
      return true;
    },
    writeFileSync: jest.fn(),
  };
});

test('setup of fusionrc', async () => {
  const fs = require('fs');
  await addFusionRC({destDir: 'somedir'});
  expect(fs.writeFileSync.mock.calls[0][0]).toEqual(`somedir/.fusionrc.js`);
  expect(fs.writeFileSync.mock.calls[0][1]).toMatchInlineSnapshot(`
"module.exports = {
  \\"assumeNoImportSideEffects\\": true,
  \\"nodeBuiltins\\": {
    \\"process\\": \\"mock\\",
    \\"Buffer\\": true
  },
  \\"babel\\": {
    \\"plugins\\": [
      [
        \\"module-resolver\\",
        {}
      ]
    ],
    \\"presets\\": []
  }
};"
`);
  expect(fs.writeFileSync.mock.calls[1][0]).toEqual(`somedir/package.json`);
  expect(fs.writeFileSync.mock.calls[1][1]).toMatchInlineSnapshot(`
"{
  \\"dependencies\\": {
    \\"babel-eslint\\": \\"0\\",
    \\"babel-plugin-module-resolver\\": \\"0\\"
  },
  \\"devDependencies\\": {
    \\"babel-eslint\\": \\"0\\",
    \\"babel-plugin-module-resolver\\": \\"0\\"
  }
}"
`);
  expect(fs.writeFileSync.mock.calls).toHaveLength(2);
});
