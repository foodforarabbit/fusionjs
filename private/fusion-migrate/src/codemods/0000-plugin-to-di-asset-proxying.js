const compose = require('../utils/compose');
const bump = require('../utils/bump-version');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(
  bump('@uber/fusion-plugin-s3-asset-proxying', '0.3.0'),
  migrate('AssetProxyingPlugin')
);
