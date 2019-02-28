const babylon = require('babylon');

module.exports = function ensureImportDeclaration(body, importString) {
  const declaration = babylon
    .parse(importString, {sourceType: 'module'})
    .program.body.pop();
  const matchingNode = body.find(n => {
    return (
      n.type === 'ImportDeclaration' &&
      n.source.value === declaration.source.value
    );
  });
  if (!matchingNode) {
    let index = 0;
    while (index < body.length && body[index].type === 'ImportDeclaration') {
      index++;
    }
    body.splice(Math.max(index - 1, 0), 0, declaration);
    return;
  }
  declaration.specifiers.forEach(newSpecifier => {
    const hasMatchingSpecifier = matchingNode.specifiers.some(
      existingSpecifier => {
        if (
          newSpecifier.type === 'ImportDefaultSpecifier' &&
          existingSpecifier.type === 'ImportDefaultSpecifier'
        ) {
          return true;
        }
        if (
          newSpecifier.type === existingSpecifier.type &&
          newSpecifier.imported.name === existingSpecifier.imported.name
        ) {
          return true;
        }
        return false;
      }
    );
    if (!hasMatchingSpecifier) {
      matchingNode.specifiers.push(newSpecifier);
    }
  });
};
