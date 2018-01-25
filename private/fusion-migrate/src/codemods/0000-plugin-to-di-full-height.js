const compose = require('../utils/compose');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(migrate('FullHeightPlugin'), ({source}) =>
  source.replace(
    `import {html} from 'fusion-core';

export default (__NODE__
  ? () => {
      const escaped = html\`<style>
html,body,#root{height:100%;}
</style>\`;
      return (ctx, next) => {
        if (ctx.element) {
          ctx.body.head.push(escaped);
        }
        return next();
      };
    }
  : () => {});`,
    `import {createPlugin, html} from 'fusion-core';

export default (__NODE__ ?
  createPlugin({
    middleware() {
      const escaped = html\`<style>
  html,body,#root{height:100%;}
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
