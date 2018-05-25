module.exports = function findParent(path, type) {
  path = path.parentPath;
  while (path) {
    if (path.type === type) {
      return path;
    }
    path = path.parentPath;
  }
  return null;
};
