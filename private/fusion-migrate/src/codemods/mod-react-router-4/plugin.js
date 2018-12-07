const visitNamedModule = require('../../utils/visit-named-module.js');
const t = require('@babel/types');

module.exports = () => {
  const namedModuleVisitor = visitNamedModule({
    moduleName: 'Route',
    packageName: 'react-router',
    refsHandler: (t, state, refPaths, path) => {
      refPaths.forEach(refPath => {
        const elementPath = refPath.parentPath.parentPath;
        const isTopLevel = refPath.parentPath.type !== 'JSXElement';
        const openingElement = elementPath.node.openingElement;
        const closingElement = elementPath.node.closingElement;
        const props = openingElement.attributes;
        const children = elementPath.node.children;

        // Ensure leading slash
        ensureLeadingSlash(openingElement.attributes);
        // Handle nested routes
        if (children.length) {
          let componentName = null;
          openingElement.attributes = props.filter(p => {
            if (p.name.name === 'component') {
              componentName = p.value.expression.name;
              return false;
            }
            return true;
          });
          if (!componentName) {
            return;
          }

          const componentBinding = path.scope.bindings[componentName];
          // Wrap to level route component in withRouter
          // This should only be triggered in the case where there was no dataDependency
          if (isTopLevel && componentBinding) {
            if (
              componentBinding.path.type === 'ImportDefaultSpecifier' ||
              componentBinding.path.type === 'ImportNamespaceSpecifier'
            ) {
              const identifier = path.scope.generateUidIdentifier(
                componentName
              );
              componentBinding.path.parentPath.insertAfter(
                t.VariableDeclaration('const', [
                  t.VariableDeclarator(
                    identifier,
                    t.callExpression(t.identifier('withRouter'), [
                      t.identifier(componentName),
                    ])
                  ),
                ])
              );
              componentName = identifier.name;
            }
          }
          const pathProp = openingElement.attributes.find(
            p => p.name.name === 'path'
          );
          if (pathProp) {
            const value =
              pathProp.value.type === 'JSXExpressionContainer'
                ? pathProp.value.expression
                : pathProp.value;
            if (value.type === 'StringLiteral' && value.value === '/') {
              openingElement.name.name = componentName;
              closingElement.name.name = componentName;
              openingElement.attributes = [
                t.JSXAttribute(
                  t.JSXIdentifier('match'),
                  t.JSXExpressionContainer(
                    t.ObjectExpression([
                      t.ObjectProperty(
                        t.Identifier('params'),
                        t.ObjectExpression([])
                      ),
                    ])
                  )
                ),
              ];
              return;
            }
          }
          const {name} = elementPath.scope.generateUidIdentifier('props');
          const propsId = t.Identifier(name);
          openingElement.attributes.push(
            t.JSXAttribute(
              t.JSXIdentifier('render'),
              t.JSXExpressionContainer(
                t.ArrowFunctionExpression(
                  [propsId],
                  t.BlockStatement([
                    t.returnStatement(
                      getRenderReturn(propsId, componentName, children)
                    ),
                  ])
                )
              )
            )
          );
          elementPath.node.children = [];
          openingElement.selfClosing = true;
          elementPath.node.closingElement = null;
        } else {
          // Add exact prop
          const exactProp = props.find(p => {
            return p.name.name === 'exact';
          });
          if (!exactProp) {
            openingElement.attributes.push(
              t.JSXAttribute(t.JSXIdentifier('exact'))
            );
          }
        }
      });
    },
  });
  return {
    name: 'react-router-4',
    visitor: namedModuleVisitor,
  };
};

function ensureLeadingSlash(attrs) {
  attrs.forEach(p => {
    if (
      p.name.name === 'path' &&
      p.value.type === 'StringLiteral' &&
      !p.value.value.startsWith('/')
    ) {
      p.value.value = `/${p.value.value}`;
    }
  });
}

function getRenderReturn(propsId, componentName, children) {
  const componentId = t.JSXIdentifier(componentName);
  children.forEach(child => {
    if (child.type === 'JSXElement') {
      ensureLeadingSlash(child.openingElement.attributes);
      // Add parent matched path
      child.openingElement.attributes.forEach(attr => {
        if (attr.name.name === 'path') {
          let oldValue =
            attr.value.type === 'StringLiteral'
              ? attr.value
              : attr.value.expression;
          attr.value = t.JSXExpressionContainer(
            t.BinaryExpression(
              '+',
              t.MemberExpression(
                t.MemberExpression(propsId, t.Identifier('match')),
                t.Identifier('path')
              ),
              oldValue
            )
          );
        }
      });
    }
  });
  return t.JSXElement(
    t.JSXOpeningElement(componentId, [t.JSXSpreadAttribute(propsId)], false),
    t.JSXClosingElement(componentId),
    [
      t.JSXElement(
        t.JSXOpeningElement(t.JSXIdentifier('Switch'), [], false),
        t.JSXClosingElement(t.JSXIdentifier('Switch')),
        children
      ),
    ]
  );
}
