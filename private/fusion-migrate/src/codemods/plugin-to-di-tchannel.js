const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import TChannelPlugin from '@uber/fusion-plugin-tchannel';`,
      `import TChannelToken from '@uber/fusion-tokens';
import TChannelPlugin from '@uber/fusion-plugin-tchannel';`
    );
  },
  ({source}) => {
    return source.replace(
      `const TChannel = app.plugin(TChannelPlugin, {service, Logger, M3});`,
      `app.register(TChannelToken, TChannelPlugin);`
    );
  }
);
