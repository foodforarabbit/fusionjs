const compose = require('../utils/compose');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(migrate('FaviconPlugin'), ({source}) =>
  source.replace(
    `/*
NOTE: A better solution for DOM template changes will be coming in a future release and
this plugin will be completely removed in favor of a better interface
*/
import {assetUrl, dangerouslySetHTML} from 'fusion-core';

export default (__NODE__
  ? () => {
      const iconUrl = assetUrl('../static/favicon.ico');
      // It would be nice if we could do this without dangerouslySetHTML, but without it, the assetUrl() result is escaped (which doesn't work)
      const escaped = dangerouslySetHTML(
        \`<link rel="shortcut icon" type="image/x-icon" href="\${iconUrl}"><link rel="icon" type="image/x-icon" href="\${iconUrl}">\`
      );
      return (ctx, next) => {
        if (ctx.element) {
          ctx.body.head.push(escaped);
        }
        return next();
      };
    }
  : () => {});`,
    `/*
NOTE: A better solution for DOM template changes will be coming in a future release and
this plugin will be completely removed in favor of a better interface
*/
import {createPlugin, assetUrl, dangerouslySetHTML} from 'fusion-core';

export default (__NODE__ ?
  createPlugin({
    middleware() {
      const iconUrl = assetUrl('../static/favicon.ico');
      // It would be nice if we could do this without dangerouslySetHTML, but without it, the assetUrl() result is escaped (which doesn't work)
      const escaped = dangerouslySetHTML(
        \`<link rel="shortcut icon" type="image/x-icon" href="\${iconUrl}"><link rel="icon" type="image/x-icon" href="\${iconUrl}">\`
      );
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
