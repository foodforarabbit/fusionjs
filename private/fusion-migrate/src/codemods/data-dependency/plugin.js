const babylon = require('babylon');
const addComment = require('../../utils/add-comment.js');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const getProgram = require('../../utils/get-program.js');
const t = require('@babel/types');

module.exports = () => {
  let components = {};
  return {
    name: 'data-dependency',
    visitor: {
      JSXElement: path => {
        const attributes = path.node.openingElement.attributes.filter(
          attr => attr.type !== 'JSXSpreadAttribute'
        );
        const {component, dataDependency} = attributes.reduce((obj, attr) => {
          obj[attr.name.name] = attr;
          return obj;
        }, {});
        if (!component || !dataDependency) {
          return;
        }
        path.node.openingElement.attributes = attributes.filter(attr => {
          if (attr.name.name === 'dataDependency') {
            return false;
          }
          return true;
        });

        const isTopLevel = path.parentPath.type !== 'JSXElement';

        const program = getProgram(path);
        const body = program.node.body;
        ensureImportDeclaration(body, `import {compose} from 'redux';`);
        ensureImportDeclaration(
          body,
          `import {createRPCPromise} from '@uber/web-rpc-redux';`
        );
        ensureImportDeclaration(body, `import {connect} from 'react-redux';`);
        ensureImportDeclaration(body, `import {prepared} from 'fusion-react';`);
        ensureImportDeclaration(
          body,
          `import {withRouter} from 'fusion-plugin-react-router'`
        );
        const componentOldIdentifier = component.value.expression;
        const newIdentifier = path.scope.generateUidIdentifier(
          `${componentOldIdentifier.name}WithData`
        );
        let dependencyExpression = dataDependency.value;
        let dependencyName;
        if (dataDependency.value.type === 'StringLiteral') {
          dependencyName = dataDependency.value.value;
        } else {
          dependencyExpression = dataDependency.value.expression;
          if (dependencyExpression.type === 'MemberExpression') {
            dependencyName = dependencyExpression.property.name;
          } else if (dependencyExpression.type === 'ArrayExpression') {
            // TODO Handle single element here
            return handleArrayExpression({
              path,
              component,
              components,
              dependencyExpression,
            });
          } else {
            throw new Error(
              `Unsupported dependencyExpression type: ${dependencyExpression.type}`
            );
          }
        }
        if (components[dependencyName]) {
          // Already generated a hoc in scope
          component.value.expression = components[dependencyName];
        } else {
          components[dependencyName] = newIdentifier;
          component.value.expression = newIdentifier;
          const rpcPromiseDeclaration = getRPCPromiseDeclaration(
            dependencyName,
            dependencyExpression
          );
          const declaration = t.VariableDeclaration('const', [
            t.VariableDeclarator(
              newIdentifier,
              t.CallExpression(
                t.CallExpression(
                  t.identifier('compose'),
                  [
                    isTopLevel && t.identifier('withRouter'),
                    getConnectFunction(dependencyName),
                    getPrepareFunction(dataDependency),
                  ].filter(Boolean)
                ),
                [componentOldIdentifier]
              )
            ),
          ]);
          addComment(
            declaration,
            'TODO: You may want to move this into the container component file'
          );
          insertAfterLastImport(body, declaration);
          insertAfterLastImport(body, rpcPromiseDeclaration);
        }
      },
      Program: {
        exit() {
          components = {}; // clear cache between test runs
        },
      },
    },
  };
};

function handleArrayExpression({
  path,
  component,
  dependencyExpression,
  components,
}) {
  const program = getProgram(path);
  const body = program.node.body;
  const depNames = [];
  const rpcPromiseDeclarations = [];
  const componentOldIdentifier = component.value.expression;
  const newIdentifier = path.scope.generateUidIdentifier(
    `${componentOldIdentifier.name}WithData`
  );
  dependencyExpression.elements.forEach(dataDependency => {
    let dependencyName;
    if (dataDependency.type === 'StringLiteral') {
      dependencyName = dataDependency.value;
    } else if (dataDependency.type === 'MemberExpression') {
      dependencyName = dataDependency.property.name;
    } else {
      throw new Error(
        'Unsupported data dependency expression type',
        dataDependency.type
      );
    }
    if (components[dependencyName]) {
      // This is necessary to keep the order of declarations correct
      program.traverse({
        VariableDeclarator(declarationPath) {
          if (declarationPath.node.id.name === dependencyName) {
            declarationPath.remove();
          }
        },
      });
    }
    components[dependencyName] = newIdentifier;
    component.value.expression = newIdentifier;
    rpcPromiseDeclarations.push(
      getRPCPromiseDeclaration(dependencyName, dataDependency)
    );
    depNames.push(dependencyName);
  });

  const declaration = t.VariableDeclaration('const', [
    t.VariableDeclarator(
      newIdentifier,
      t.CallExpression(
        t.CallExpression(t.identifier('compose'), [
          getConnectFunction(depNames),
          getPrepareFunction(dependencyExpression.elements),
        ]),
        [componentOldIdentifier]
      )
    ),
  ]);
  addComment(
    declaration,
    'TODO: You may want to move this into the container component file'
  );
  insertAfterLastImport(body, declaration);
  rpcPromiseDeclarations.forEach(promiseDeclaration =>
    insertAfterLastImport(body, promiseDeclaration)
  );
}

function getConnectFunction(dependencyName) {
  const returnStatement = t.returnStatement(t.objectExpression([]));
  const depNames = Array.isArray(dependencyName)
    ? dependencyName.join(',')
    : dependencyName;
  addComment(returnStatement, 'TODO: get things from state you need here');
  return t.CallExpression(t.identifier('connect'), [
    t.arrowFunctionExpression(
      [t.identifier('state')],
      t.blockStatement([returnStatement])
    ),
    babylon.parseExpression(`{${depNames}}`),
  ]);
}

function getPrepareFunction(dataDependency) {
  let returnStatement;
  const paramsExpression = t.memberExpression(
    t.memberExpression(t.identifier('props'), t.identifier('match')),
    t.identifier('params')
  );
  if (Array.isArray(dataDependency)) {
    returnStatement = t.callExpression(
      t.memberExpression(t.identifier('Promise'), t.identifier('all')),
      [
        t.arrayExpression(
          dataDependency.map(dep => {
            return t.callExpression(
              t.memberExpression(
                t.identifier('props'),
                dep.type === 'StringLiteral' ? t.identifier(dep.value) : dep,
                dep.type !== 'StringLiteral'
              ),
              [paramsExpression]
            );
          })
        ),
      ]
    );
  } else {
    returnStatement = t.callExpression(
      t.memberExpression(
        t.identifier('props'),
        dataDependency.value.expression ||
          t.identifier(dataDependency.value.value),
        dataDependency.value.type !== 'StringLiteral'
      ),
      [paramsExpression]
    );
  }
  returnStatement = t.returnStatement(
    t.callExpression(
      t.memberExpression(returnStatement, t.identifier('catch')),
      [t.arrowFunctionExpression([], t.blockStatement([]))]
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

function getRPCPromiseDeclaration(dependencyName, dependencyExpression) {
  return t.VariableDeclaration('const', [
    t.VariableDeclarator(
      t.identifier(dependencyName),
      t.arrowFunctionExpression(
        [t.identifier('args')],
        t.blockStatement([
          t.returnStatement(
            t.callExpression(t.identifier('createRPCPromise'), [
              dependencyExpression,
              t.identifier('args'),
            ])
          ),
        ])
      )
    ),
  ]);
}
