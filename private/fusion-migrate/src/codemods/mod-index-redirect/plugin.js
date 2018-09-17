const visitNamedModule = require('../../utils/visit-named-module.js');
const getProgram = require('../../utils/get-program.js');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');

module.exports = () => {
  const namedModuleVisitor = visitNamedModule({
    moduleName: 'IndexRedirect',
    packageName: 'react-router',
    refsHandler: (t, state, refPaths) => {
      refPaths.forEach(refPath => {
        const program = getProgram(refPath);
        const body = program.node.body;
        ensureImportDeclaration(body, `import {Redirect} from 'react-router'`);
        const elementPath = refPath.parentPath.parentPath;
        elementPath.replaceWith(
          t.JSXElement(
            t.JSXOpeningElement(
              t.JSXIdentifier('Route'),
              [
                t.JSXAttribute(t.JSXIdentifier('path'), t.StringLiteral('/')),
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
                            t.JSXClosingElement(t.JSXIdentifier('Redirect')),
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
            t.JSXClosingElement(t.JSXIdentifier('Route')),
            []
          )
        );
      });
    },
  });
  return {
    name: 'index-redirect',
    visitor: namedModuleVisitor,
  };
};
