const compose = require('../utils/compose');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(migrate('CssResetPlugin'), ({source}) =>
  source.replace(
    `/*
NOTE: A better solution for template styles will be coming in a future release and
this plugin will be completely removed in favor of a better interface
*/
import {html} from 'fusion-core';

export default (__NODE__
  ? () => {
      const escaped = html\`<style>
html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0);}
body{margin:0;}
button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0;}
input::-webkit-inner-spin-button,input::-webkit-outer-spin-button,input::-webkit-search-cancel-button,input::-webkit-search-decoration,input::-webkit-search-results-button,input::-webkit-search-results-decoration{display:none;}
</style>\`;
      return (ctx, next) => {
        if (ctx.element) {
          ctx.body.head.push(escaped);
        }
        return next();
      };
    }
  : () => {});`,
    `/*
NOTE: A better solution for template styles will be coming in a future release and
this plugin will be completely removed in favor of a better interface
*/
import {createPlugin, html} from 'fusion-core';

export default (__NODE__ ?
  createPlugin({
    middleware() {
      const escaped = html\`<style>
html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0);}
body{margin:0;}
button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0;}
input::-webkit-inner-spin-button,input::-webkit-outer-spin-button,input::-webkit-search-cancel-button,input::-webkit-search-decoration,input::-webkit-search-results-button,input::-webkit-search-results-decoration{display:none;}
</style>\`;
      return (ctx, next) => {
        if (ctx.element) {
          ctx.body.head.push(escaped);
        }
        return next();
      };
    }
  }) : null);`
  )
);
