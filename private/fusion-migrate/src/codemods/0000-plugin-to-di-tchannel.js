const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-tchannel', '0.3.2'),
  ({source}) => {
    return source.replace(
      `import TChannelPlugin from '@uber/fusion-plugin-tchannel';`,
      `import TChannel, {TChannelToken} from '@uber/fusion-plugin-tchannel';`
    );
  },
  ({source}) => {
    return source.replace(
      `const TChannel = app.plugin(TChannelPlugin, {service, Logger, M3});`,
      `app.register(TChannelToken, TChannel);`
    );
  }
);
