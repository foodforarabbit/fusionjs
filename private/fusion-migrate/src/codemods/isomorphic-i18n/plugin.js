const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const getProgram = require('../../utils/get-program.js');
const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const t = babel.types;

  const refsHandler = (t, state, refPaths, path) => {
    const body = getProgram(path).node.body;
    let shouldAddTranslateImport = false;
    let shouldAddI18nCompatImport = false;
    refPaths.forEach(refPath => {
      let callPath = refPath.parentPath;
      if (refPath.parentPath.type === 'MemberExpression') {
        if (refPath.parent.property.name !== 't') {
          refPath.parentPath.parentPath.remove();
          return;
        }
        // i18n.t() has call expression one level higher than t()
        callPath = callPath.parentPath;
      }
      const args = callPath.node.arguments;
      // called with string literal, can automatically migrate to <Translate> component
      if (args && args.length && args[0].type === 'StringLiteral') {
        const attributePath = refPath.parentPath.parentPath.parentPath;
        const jsxElementPath = attributePath.parentPath.parentPath;
        // checks for props passed to native elements. i.e <input placeholder={i18n.t('test')} />
        if (
          attributePath.type === 'JSXAttribute' &&
          jsxElementPath.node.openingElement.name.type === 'JSXIdentifier' &&
          jsxElementPath.node.openingElement.name.name[0] ===
            jsxElementPath.node.openingElement.name.name[0].toLowerCase()
        ) {
          return;
        }
        shouldAddTranslateImport = true;
        const element = t.JSXElement(
          t.JSXOpeningElement(
            t.JSXIdentifier('Translate'),
            [
              t.JSXAttribute(t.JSXIdentifier('id'), args[0]),
              args.length === 2 &&
                t.JSXAttribute(
                  t.JSXIdentifier('data'),
                  t.JSXExpressionContainer(args[1])
                ),
            ].filter(Boolean)
          ),
          t.JSXClosingElement(t.JSXIdentifier('Translate')),
          [],
          true
        );
        // Replace with <Translate> component with key and optional data props
        if (
          callPath.parentPath.type === 'JSXExpressionContainer' &&
          callPath.parentPath.parentPath.type === 'JSXElement'
        ) {
          callPath.parentPath.replaceWith(element);
        } else {
          callPath.replaceWith(element);
        }
        ensureImportDeclaration(body, `import React from 'react'`);
      } else {
        // called with non-string literal. Cannot manually migrate
        shouldAddI18nCompatImport = true;
      }
    });
    if (shouldAddTranslateImport) {
      ensureImportDeclaration(
        body,
        `import {Translate} from 'fusion-plugin-i18n-react'`
      );
    }
    if (shouldAddI18nCompatImport) {
      path.node.source.value = '@uber/isomorphic-i18n-compat';
    } else {
      path.remove();
    }
  };

  const visitor = visitNamedModule({
    t,
    packageName: ['@uber/bedrock/isomorphic-i18n', '@uber/isomorphic-i18n'],
    moduleName: 't',
    visitDefault: true,
    refsHandler,
  });

  return {
    name: 'isomorphic-i18n',
    visitor,
  };
};
