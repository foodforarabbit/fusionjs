module.exports = team => () => {
  return {
    name: 'team-name',
    visitor: {
      VariableDeclarator(path) {
        if (
          path.node.id.name === 'team' &&
          path.node.init.type === 'StringLiteral'
        ) {
          path.node.init.value = team;
        }
      },
    },
  };
};
