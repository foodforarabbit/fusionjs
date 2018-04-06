const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const log = require('../log.js');

module.exports = class StepRunner {
  constructor(dir) {
    this.completedSteps = [];
    this.dir = dir;
  }
  async step(fn, stepId) {
    if (!stepId)
      throw new Error(`Internal Error: ${fn.name} is missing a step id`);
    try {
      let result = fn();
      if (result instanceof Promise) {
        result = await result;
      }
      this.completedSteps.push(stepId);
      return true;
    } catch (error) {
      log(chalk.red(`Failed at step ${stepId}`), error);
      const report = {
        completedSteps: this.completedSteps,
        failedStep: stepId,
        error: {
          message: error.message,
          stack: error.stack,
        },
      };
      fs.writeFileSync(
        path.join(this.dir, 'migration-report.json'),
        JSON.stringify(report, null, 2)
      );
      return false;
    }
  }
};
