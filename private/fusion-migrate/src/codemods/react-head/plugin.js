const {astOf} = require('../../utils');
const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const t = babel.types;

  const refsHandler = (t, state, refPaths, path) => {
    path.replaceWith(
      astOf(`import {Helmet} from 'fusion-plugin-react-helmet-async';`)
    );
    refPaths.forEach(refPath => {
      const props = refPath.parentPath.node.attributes;
      const {title, link, meta, htmlAttributes} = props.reduce((acc, prop) => {
        acc[prop.name.name] = prop;
        return acc;
      }, {});

      props.forEach(removeNonBlocking);

      refPath.parentPath.parentPath.replaceWith(
        t.JSXElement(
          t.JSXOpeningElement(t.JSXIdentifier('Helmet'), [], false),
          t.JSXClosingElement(t.JSXIdentifier('Helmet')),
          [title && getTitleElement(title)]
            .concat(link && getHelmetElements('link', link))
            .concat(meta && getHelmetElements('meta', meta))
            .concat(htmlAttributes && getHtmlAttributeElements(htmlAttributes))
            .filter(Boolean)
        )
      );
    });
  };

  const visitor = visitNamedModule({
    t,
    packageName: ['@uber/react-head', 'react-helmet'],
    moduleName: ['Component', 'Helmet'],
    refsHandler,
  });

  function getTitleElement(title) {
    let titleElement;
    if (title.value.type === 'StringLiteral') {
      titleElement = t.JSXText(title.value.value);
    } else {
      titleElement = title.value;
    }
    return t.JSXElement(
      t.JSXOpeningElement(t.JSXIdentifier('title'), [], false),
      t.JSXClosingElement(t.JSXIdentifier('title')),
      [titleElement]
    );
  }

  function getHelmetElements(type, list) {
    return list.value.expression.elements.map(el => {
      return t.JSXElement(
        t.JSXOpeningElement(
          t.JSXIdentifier(type),
          el.properties.map(prop => {
            const value =
              prop.value.type === 'StringLiteral'
                ? prop.value
                : t.JSXExpressionContainer(prop.value);
            return t.JSXAttribute(t.JSXIdentifier(prop.key.name), value);
          }),
          true
        ),
        t.JSXClosingElement(t.JSXIdentifier(type)),
        []
      );
    });
  }

  function getHtmlAttributeElements(htmlAttributes) {
    return t.JSXElement(
      t.JSXOpeningElement(
        t.JSXIdentifier('html'),
        htmlAttributes.value.expression.properties.map(prop => {
          const value =
            prop.value.type === 'StringLiteral'
              ? prop.value
              : t.JSXExpressionContainer(prop.value);
          return t.JSXAttribute(t.JSXIdentifier(prop.key.name), value);
        }),
        true
      ),
      t.JSXClosingElement(t.JSXIdentifier('html')),
      []
    );
  }

  return {
    name: 'react-head',
    visitor,
  };
};

function removeNonBlocking(item) {
  if (item.value.type !== 'JSXExpressionContainer') {
    return;
  }
  if (item.value.expression.type !== 'ArrayExpression') {
    return;
  }
  const expression = item.value.expression;
  expression.elements.forEach(el => {
    if (el.type !== 'ObjectExpression') {
      return;
    }
    el.properties = el.properties.filter(prop => {
      if (prop.key.name === 'nonBlocking') {
        return false;
      }
      return true;
    });
  });
}
