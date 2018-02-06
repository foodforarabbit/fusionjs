const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('fusion-plugin-rpc', '0.6.3'),
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
  },
  ({source, path}, {jscodeshift: j}) => {
    if (path === 'src/rpc/handler.js') {
      return j(source)
        .find(j.ExportDefaultDeclaration)
        .replaceWith(p => {
          const tpl = `import {createPlugin} from 'fusion-core';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';

export default __NODE__ &&
  createPlugin({
    deps: {atreyu: AtreyuToken, logger: LoggerToken, m3: M3Token},
    provides: PROVIDES,
  });`;
          return j(tpl)
            .find(j.Identifier, {name: 'PROVIDES'})
            .replaceWith(p.value.declaration)
            .toSource();
        })
        .toSource();
    } else return source;
  }
);
