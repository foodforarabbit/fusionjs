const babylon = require('babylon');
const addComment = require('../../utils/add-comment.js');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const getProgram = require('../../utils/get-program.js');

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
        path.node.openingElement.attributes = attributes.filter(attr => {
          if (attr.name.name === 'dataDependency') {
            return false;
          }
          return true;
        });
        if (component && dataDependency) {
          let dependencyExpression = dataDependency.value;
          let dependencyName;
          if (dataDependency.value.type !== 'StringLiteral') {
            dependencyExpression = dataDependency.value.expression;
            if (dependencyExpression.type === 'MemberExpression') {
              dependencyName = dependencyExpression.property.name;
            } else {
              throw new Error(
                `Unsupported dependencyExpression type: ${
                  dependencyExpression.type
                }`
              );
            }
          } else {
            dependencyName = dataDependency.value.value;
          }
          const componentOldIdentifier = component.value.expression;
          const newIdentifier = path.scope.generateUidIdentifier(
            `${componentOldIdentifier.name}WithData`
          );
          component.value.expression = newIdentifier;
          const body = getProgram(path).node.body;
          const rpcPromiseDeclaration = t.VariableDeclaration('const', [
            t.VariableDeclarator(
              t.identifier(dependencyName),
              t.arrowFunctionExpression(
                [],
                t.blockStatement([
                  t.returnStatement(
                    t.callExpression(t.identifier('createRPCPromise'), [
                      dependencyExpression,
                    ])
                  ),
                ])
              )
            ),
          ]);
          const declaration = t.VariableDeclaration('const', [
            t.VariableDeclarator(
              newIdentifier,
              t.CallExpression(
                t.CallExpression(t.identifier('compose'), [
                  getConnectFunction(t, dependencyName),
                  getPrepareFunction(t, dataDependency),
                ]),
                [componentOldIdentifier]
              )
            ),
          ]);
          insertAfterLastImport(body, declaration);
          insertAfterLastImport(body, rpcPromiseDeclaration);
          ensureImportDeclaration(body, `import {compose} from 'redux';`);
          ensureImportDeclaration(
            body,
            `import {createRPCPromise} from '@uber/web-rpc-redux';`
          );
          ensureImportDeclaration(body, `import {connect} from 'react-redux';`);
          ensureImportDeclaration(
            body,
            `import {prepared} from 'fusion-react-async';`
          );
        }
      },
    },
  };
};

function getConnectFunction(t, dependencyName) {
  const returnStatement = t.returnStatement(t.objectExpression([]));
  addComment(returnStatement, 'TODO: get things from state you need here');
  return t.CallExpression(t.identifier('connect'), [
    t.arrowFunctionExpression(
      [t.identifier('state')],
      t.blockStatement([returnStatement])
    ),
    babylon.parseExpression(`{${dependencyName}}`),
  ]);
}

function getPrepareFunction(t, dataDependency) {
  // TODO: figure out how to add comments
  const returnStatement = t.returnStatement(
    t.callExpression(
      t.memberExpression(
        t.identifier('props'),
        dataDependency.value.expression ||
          t.identifier(dataDependency.value.value),
        dataDependency.value.type !== 'StringLiteral'
      ),
      []
    )
  );
  addComment(
    returnStatement,
    'TODO: You probably want to add a check to see if the data exists, or is loading.'
  );
  addComment(
    returnStatement,
    'See https://engdocs.uberinternal.com/web/docs/guides/fetching-data/#use-rpc-method-in-a-component'
  );
  return t.CallExpression(t.identifier('prepared'), [
    t.arrowFunctionExpression(
      [t.identifier('props')],
      t.blockStatement([returnStatement])
    ),
  ]);
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
