const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => source.replace(`app.plugin(HealthPlugin);`, ``),
  ({source}) =>
    source.replace(
      `// node specific plugins`,
      `// node specific plugins
app.register(HealthPlugin);`
    ),
  ({source}) =>
    source.replace(
      `export default (__NODE__
  ? () => {
      return (ctx, next) => {
        if (!ctx.element && ctx.url === '/health') {
          ctx.status = 200;
          ctx.body = 'OK';
        }
        return next();
      };
    }
  : () => {});`,
      `import {createPlugin} from 'fusion-core';

export default (__NODE__ ?
  createPlugin({
    middleware() {
      return (ctx, next) => {
        if (!ctx.element && ctx.url === '/health') {
          ctx.status = 200;
          ctx.body = 'OK';
        }
        return next();
      };
    }
  }) : null);`
    )
);
