module.exports = () => {
  return {
    name: 'upgrade-enzyme',
    visitor: {
      Identifier(path) {
        if (path.node.name === 'getNode') {
          path.node.name = 'instance';
        }
      },
    },
  };
};
