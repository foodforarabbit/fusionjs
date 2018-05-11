const {matchStatement} = require('../../utils/index.js');

module.exports = () => {
  return {
    name: 'remove-enzyme-adapter',
    visitor: {
      ImportDeclaration(path) {
        const enzyme = `import Enzyme, {mount} from 'enzyme'`;
        if (matchStatement(path, enzyme)) {
          path.node.specifiers.shift();
        }

        const adapter = `import Adapter from 'enzyme-adapter-react-16'`;
        if (matchStatement(path, adapter)) {
          path.remove();
        }
      },
      ExpressionStatement(path) {
        const configure = `Enzyme.configure({adapter: new Adapter()})`;
        if (matchStatement(path, configure)) {
          path.remove();
        }
      },
    },
  };
};
