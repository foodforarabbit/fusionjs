const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('fusion-plugin-rpc-redux-react', '0.3.1'),
  ({source}) => {
    return source.replace(
      `import RPC from 'fusion-plugin-rpc-redux-react';`,
      `import RPC, {RPCToken, RPCConfigToken} from 'fusion-plugin-rpc-redux-react';`
    );
  },
  ({source}) => {
    return source.replace(
      `app.plugin(RPC, {
      handlers: getRPCHandlers({Atreyu, Logger, M3}),
      EventEmitter: UniversalEvents,
    });`,
      `app.register(RPCToken, RPC);
    app.register(RPCConfigToken, getRPCHandlers);`
    );
  },
  ({source}) => {
    return source.replace(
      `app.plugin(RPC, {
      EventEmitter: UniversalEvents,
      fetch,
    });`,
      `app.register(RPCToken, RPC);`
    );
  }
);
