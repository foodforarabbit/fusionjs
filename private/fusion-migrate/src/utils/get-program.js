module.exports = function getProgram(path) {
  if (!path.parentPath) {
    return path;
  }
  return getProgram(path.parentPath);
};
