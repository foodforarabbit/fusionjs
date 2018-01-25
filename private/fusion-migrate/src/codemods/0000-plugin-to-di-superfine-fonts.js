const compose = require('../utils/compose');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(migrate('SuperfineFontsPlugin'), ({source}) =>
  source.replace(
    `/*
NOTE: A better solution for font loading will be coming in a future release and
this plugin will be completely removed in favor of a better interface
*/
import {html} from 'fusion-core';

export default (__NODE__
  ? () => {
      const escaped = html\`<link href="https://d1a3f4spazzrp4.cloudfront.net/uber-fonts/4.0.0/superfine.css" rel="stylesheet">\`;
      return (ctx, next) => {
        if (ctx.element) {
          ctx.body.head.push(escaped);
        }
        return next();
      };
    }
  : () => {});`,
    `/*
NOTE: A better solution for font loading will be coming in a future release and
this plugin will be completely removed in favor of a better interface
*/
import {createPlugin, html} from 'fusion-core';

export default (__NODE__
  ? createPlugin({
    middleware() {
      const escaped = html\`<link href="https://d1a3f4spazzrp4.cloudfront.net/uber-fonts/4.0.0/superfine.css" rel="stylesheet">\`;
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
