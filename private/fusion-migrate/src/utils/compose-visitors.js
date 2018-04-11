function composeVisitors(...visitors) {
  const finalVisitor = {};
  visitors.forEach(vis => {
    Object.keys(vis).forEach(visKey => {
      finalVisitor[visKey] = finalVisitor[visKey] || [];
      finalVisitor[visKey].push(vis[visKey]);
    });
  });
  Object.keys(finalVisitor).forEach(finalVisKey => {
    const fns = finalVisitor[finalVisKey];
    finalVisitor[finalVisKey] = (path, state) => {
      fns.forEach(fn => {
        fn(path, state);
      });
    };
  });
  return finalVisitor;
}

module.exports = composeVisitors;
