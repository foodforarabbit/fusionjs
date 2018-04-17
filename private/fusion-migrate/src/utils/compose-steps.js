module.exports = function composeSteps(...steps) {
  return async () => {
    for (const step of steps) {
      await step();
    }
  };
};
