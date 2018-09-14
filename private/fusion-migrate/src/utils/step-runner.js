const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const log = require('../log.js');

module.exports = class StepRunner {
  constructor(dir, version) {
    this.dir = dir;
    this.version = version;
    this.reportPath = path.join(this.dir, 'migration-report.json');
    this.completedSteps = [];
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
        version: this.version,
        completedSteps: this.completedSteps,
        failedStep: stepId,
        error: {
          message: error.message,
          stack: error.stack,
        },
      };
      fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
      return false;
    }
  }
};
