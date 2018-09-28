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
    if (
      body[0] &&
      body[0].leadingComments &&
      body[0].leadingComments[0] &&
      body[0].leadingComments[0].value.match(/@flow/)
    ) {
      const flowComment = body[0].leadingComments.shift();
      declaration.leadingComments = [
        flowComment,
        ...(declaration.leadingComments || []),
      ];
    }
    body.unshift(declaration);
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
