const visitNamedModule = require('../../utils/visit-named-module.js');
const getProgram = require('../../utils/get-program.js');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');

module.exports = () => {
  const namedModuleVisitor = visitNamedModule({
    moduleName: 'Redirect',
    packageName: 'react-router',
    refsHandler: (t, state, refPaths) => {
      refPaths.forEach(refPath => {
        const program = getProgram(refPath);
        const body = program.node.body;
        ensureImportDeclaration(body, `import {Redirect} from 'react-router'`);
        const elementPath = refPath.parentPath.parentPath;
        const fromAttr = elementPath.node.openingElement.attributes.find(f => {
          return f.name.name === 'from';
        });
        fromAttr.name.name = 'path';
        elementPath.replaceWith(
          t.JSXElement(
            t.JSXOpeningElement(
              t.JSXIdentifier('Route'),
              [
                fromAttr,
                t.JSXAttribute(t.JSXIdentifier('exact')),
                t.JSXAttribute(
                  t.JSXIdentifier('render'),
                  t.JSXExpressionContainer(
                    t.arrowFunctionExpression(
                      [t.Identifier('props')],
                      t.BlockStatement([
                        t.ReturnStatement(
                          t.JSXElement(
                            t.JSXOpeningElement(
                              t.JSXIdentifier('Redirect'),
                              elementPath.node.openingElement.attributes.filter(
                                f => {
                                  return f.name.name === 'to';
                                }
                              ),
                              true
                            ),
                            null,
                            []
                          )
                        ),
                      ])
                    )
                  )
                ),
              ],
              true
            ),
            null,
            []
          )
        );
      });
    },
  });
  return {
    name: 'redirect',
    visitor: namedModuleVisitor,
  };
};