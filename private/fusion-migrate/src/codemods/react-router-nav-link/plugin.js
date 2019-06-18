const {parseJs} = require('@dubstep/core');
const visitNamedModule = require('../../utils/visit-named-module.js');
const getProgram = require('../../utils/get-program.js');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');

const styleDeclarations = parseJs(`
const navStyle = {
  color: '#fff',
  cursor: 'pointer',
  display: 'inline-block',
  padding: '15px 12px 0',
  fontWeight: '500',
  borderTop: '3px solid transparent',
};

const activeNavStyle = {
  borderTop: '3px solid #1B6DE0',
  color: '#1B6DE0',
};
`).node.body;

module.exports = () => {
  const removalVisitor = {
    Identifier(path) {
      if (path.node.name === 'isPathActive') {
        if (
          path.parentPath.node.type === 'ClassMethod' ||
          path.parentPath.node.type === 'ObjectProperty'
        ) {
          path.parentPath.remove();
        }
      }
    },
  };
  const replacementVisitor = visitNamedModule({
    packageName: '@uber/react-routing-top-bar',
    refsHandler: (t, state, refPaths, path) => {
      refPaths
        .filter(refPath => {
          return refPath.type === 'JSXIdentifier';
        })
        .forEach(refPath => {
          const openingElement = refPath.parentPath;
          const props = openingElement.node.attributes;
          const spreadProp = props.filter(
            n => n.type === 'JSXSpreadAttribute'
          )[0];
          if (!spreadProp || !spreadProp.argument.type === 'Identifier') {
            return;
          }
          const body = getProgram(path).node.body;
          ensureImportDeclaration(
            body,
            `import { TopBar, TopBarList, TopBarListItem } from '@uber/react-top-bar';`
          );
          ensureImportDeclaration(
            body,
            `import {NavLink} from 'fusion-plugin-react-router';`
          );
          const id = spreadProp.argument.name;
          const replacement = `
  <TopBar {...${id}.topBarProps}>
    <TopBarList>
      {${id}.routes.map(route => (
        <NavLink
          key={route.path}
          to={route.path}
          activeStyle={activeNavStyle}
          style={navStyle}
          isActive={match => match && match.isExact}
        >
          {route.text}
        </NavLink>
      ))}
    </TopBarList>
  </TopBar>
`;
          const parsed = parseJs(replacement);
          refPath.parentPath.parentPath.replaceWith(parsed.node.body[0]);
          refPath.scope.block.body.body.unshift(styleDeclarations[0]);
          refPath.scope.block.body.body.unshift(styleDeclarations[1]);
        });
      path.remove();
    },
  });

  return {
    name: 'react-routing-top-bar',
    visitor: {...removalVisitor, ...replacementVisitor},
  };
};
