const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => source.replace(`app.plugin(FullHeightPlugin);`, ``),
  ({source}) =>
    source.replace(
      `// node specific plugins`,
      `// node specific plugins
app.register(FullHeightPlugin);`
    ),
  ({source}) =>
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
          ctx.template.head.push(escaped);
        }
        return next();
      };
    }
  }) : null);`
    )
);
