const {matchStatement, replaceStatement} = require('../../utils');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');

module.exports = () => ({
  name: 'helmet-migrations',
  visitor: {
    Program(path) {
      ensureImportDeclaration(
        path.node.body,
        `import {Helmet} from 'fusion-plugin-react-helmet-async'`
      );
      path.node.body.splice(1, 0, path.node.body.shift());
    },
    ExportNamedDeclaration(path) {
      const before = `
        export const Root = () => (
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route component={PageNotFound} />
          </Switch>
        );
      `;
      const after = `
export const Root = () => (
  <div id="wrapper">
    <Helmet>
      <link rel="shortcut icon" type="image/x-icon" href="{assetUrl('../static/favicon.ico')}" />
      <link rel="icon" type="image/x-icon" href="{assetUrl('../static/favicon.ico')}" />
      <style>{\`
html,body,#root,#wrapper{height:100%;}
html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0);}
body{margin:0;}
button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0;}
input::-webkit-inner-spin-button,input::-webkit-outer-spin-button,input::-webkit-search-cancel-button,input::-webkit-search-decoration,input::-webkit-search-results-button,input::-webkit-search-results-decoration{display:none;}
      \`}</style>
    </Helmet>
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route component={PageNotFound} />
    </Switch>
  </div>
);
      `;
      if (matchStatement(path, before, {shallow: true})) {
        replaceStatement(path, after);
      }
    },
  },
});
