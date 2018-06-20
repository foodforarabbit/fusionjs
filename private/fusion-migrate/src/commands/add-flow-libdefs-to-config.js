module.exports = () => {
  return {
    name: 'add-flow-libdefs-to-config',
    transform: lines => {
      const libsHeader = '[libs]';
      const libdefsToAdd = [
        './node_modules/fusion-plugin-rpc-redux-react/flow-typed/npm/redux_v4.x.x.js',
        './node_modules/fusion-plugin-rpc-redux-react/flow-typed/redux-reactors_v1.x.x.js',
        './node_modules/fusion-plugin-react-redux/flow-typed/npm/redux_v3.x.x.js',
        './node_modules/fusion-plugin-redux-action-emitter-enhancer/flow-typed/npm/redux_v3.x.x.js',
        './node_modules/fusion-core/flow-typed/npm/koa_v2.x.x.js',
        './node_modules/fusion-core/flow-typed/tape-cup_v4.x.x.js',
      ];

      // Add [libs] to header if it is missing
      let indexOfLibHeader = lines.indexOf(libsHeader);
      if (indexOfLibHeader === -1) {
        lines.push(libsHeader);
        indexOfLibHeader = lines.length - 1;
      }

      for (let i = 0; i < libdefsToAdd.length; i++) {
        const libdef = libdefsToAdd[i];

        if (lines.indexOf(libdef) !== -1) {
          // skip duplicates
          continue;
        }

        lines.splice(indexOfLibHeader + 1, 0, libdef);
      }

      return lines;
    },
  };
};
