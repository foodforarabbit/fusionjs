module.exports = () => {
  return {
    name: 'deep-loose-equal',
    visitor: {
      MemberExpression(path) {
        if (isTapeLike(path)) {
          if (path.node.property.name === 'deepLooseEqual') {
            path.node.property.name = 'deepEqual';
          } else if (path.node.property.name === 'notDeepLooseEqual') {
            path.node.property.name = 'notDeepEqual';
          }
        }
      },
    },
  };
};

function isTapeLike(path) {
  return path.node.object.name === 't' || path.node.object.name === 'assert';
}
