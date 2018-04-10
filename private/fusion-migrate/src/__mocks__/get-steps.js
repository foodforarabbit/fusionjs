let steps = [];
module.exports = function() {
  return steps;
};

module.exports.__setSteps = s => {
  steps = s;
};
