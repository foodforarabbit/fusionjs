module.exports = function addComment(node, comment) {
  node.leadingComments = node.leadingComments || [];
  node.leadingComments.push({
    type: 'CommentLine',
    // Intentionally add leading whitespace
    value: ` ${comment}`,
  });
};
