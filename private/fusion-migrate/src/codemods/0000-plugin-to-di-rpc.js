const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('fusion-plugin-rpc', '0.6.2'),
  bump('fusion-plugin-rpc-redux-react', '0.3.2'),
  ({source}) => {
    return source.replace(
      `import RPC from 'fusion-plugin-rpc-redux-react';`,
      `import RPC, {RPCToken, RPCHandlersToken} from 'fusion-plugin-rpc-redux-react';`
    );
  },
  ({source}) => {
    return source.replace(
      `app.plugin(RPC, {
      handlers: getRPCHandlers({Atreyu, Logger, M3}),
      EventEmitter: UniversalEvents,
    });`,
      `app.register(RPCToken, RPC);
    app.register(RPCHandlersToken, getRPCHandlers);`
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
