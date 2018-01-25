const comopse = require('../utils/compose');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(migrate('HealthPlugin'), ({source}) =>
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
