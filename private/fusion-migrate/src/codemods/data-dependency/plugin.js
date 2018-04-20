const babylon = require('babylon');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const log = require('../../log.js');

module.exports = babel => {
  const t = babel.types;
  return {
    name: 'data-dependency',
    visitor: {
      JSXElement: path => {
        const attributes = path.node.openingElement.attributes;
        const {component, dataDependency} = attributes.reduce((obj, attr) => {
          obj[attr.name.name] = attr;
          return obj;
        }, {});
        if (component && dataDependency) {
          if (dataDependency.value.type !== 'StringLiteral') {
            log('WARNING: Unable to codemod a data dependency');
            return;
          }
          const componentOldIdentifier = component.value.expression;
          const newIdentifier = path.scope.generateUidIdentifier(
            `${componentOldIdentifier.name}WithData`
          );
          component.value.expression = newIdentifier;
          const body = getProgram(path).node.body;
          const declaration = t.VariableDeclaration('const', [
            t.VariableDeclarator(
              newIdentifier,
              t.CallExpression(
                t.CallExpression(t.identifier('compose'), [
                  t.CallExpression(t.identifier('withRPCRedux'), [
                    dataDependency.value,
                  ]),
                  t.CallExpression(t.identifier('connect'), [
                    babylon.parseExpression(`(state) => {
                        // TODO: get things from state you need here
                        return {};
                      }`),
                  ]),
                  t.CallExpression(t.identifier('prepare'), [
                    babylon.parseExpression(`({${
                      dataDependency.value.value
                    }}) => {
                        // TODO: this should check some props from connect to see you need to execute the data fetch.
                        // Once that check is added, you can remove the __NODE__ conditional
                        // See t.uber.com/web-fetching-data
                        return __NODE__ && ${dataDependency.value.value}();
                      }`),
                  ]),
                ]),
                [componentOldIdentifier]
              )
            ),
          ]);
          insertAfterLastImport(body, declaration);
          ensureImportDeclaration(body, `import {compose} from 'redux';`);
          ensureImportDeclaration(
            body,
            `import {withRPCRedux} from 'fusion-plugin-rpc-redux-react';`
          );
          ensureImportDeclaration(body, `import {connect} from 'react-redux';`);
          ensureImportDeclaration(
            body,
            `import {prepare} from 'fusion-react-async';`
          );
          return;
        }
      },
    },
  };
};

function getProgram(path) {
  if (!path.parentPath) {
    return path;
  }
  return getProgram(path.parentPath);
}

function insertAfterLastImport(body, node) {
  for (let i = body.length - 1; i >= 0; i--) {
    const item = body[i];
    if (item.type === 'ImportDeclaration' || i === 0) {
      body.splice(i + 1, 0, node);
      break;
    }
  }
}
