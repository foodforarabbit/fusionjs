module.exports = () => {
  return {
    name: 'replace-react-router-imports',
    visitor: {
      ImportDeclaration(path) {
        const sourceName = path.node.source.value;
        if (sourceName === 'react-router') {
          path.node.source.value = 'fusion-plugin-react-router';
        }
      },
    },
  };
};
