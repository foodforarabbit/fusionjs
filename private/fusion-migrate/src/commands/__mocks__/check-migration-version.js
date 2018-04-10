let version = null;
let error = null;
module.exports = () => {
  return {version, error};
};

module.exports.__setVersion = v => {
  version = v;
};

module.exports.__setError = e => {
  error = e;
};
