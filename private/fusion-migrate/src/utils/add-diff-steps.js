const diffStep = require('../commands/diff-step');

module.exports = function addDiffSteps(options) {
  return function reduceAddDiffSteps(prev, next) {
    prev.push(next);
    // pause and show diff after every step
    prev.push({
      id: `${next.id}-diff`,
      step: () => diffStep({name: next.id, ...options}),
    });
    return prev;
  };
};
