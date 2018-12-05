// @flow
import logUpdate from 'log-update';

type ProgressOptions = {
  total: number,
  title: string,
};

export function getProgress({total, title}: ProgressOptions) {
  let status = -1;
  let action = '';
  let percentage = 0;
  const log = logUpdate.create(process.stdout, {});
  const spinner = _getSpinner();
  let spinnerFrame = spinner.getFrame();
  const renderInterval = setInterval(() => {
    spinnerFrame = spinner.getFrame();
    render();
  }, 250);
  function render() {
    percentage = Math.floor((status / total) * 100);
    log(`${spinnerFrame} ${percentage}% ${action}`);
    if (status === total) {
      log(`${title} ✔`);
      log.done();
      clearInterval(renderInterval);
    }
  }
  const progress = {
    tick: (text?: string) => {
      if (typeof text === 'string') {
        action = text;
      }
      status++;
      render();
    },
  };
  progress.tick();
  return progress;
}

export function getSpinner(title: string) {
  let action = title;
  const log = logUpdate.create(process.stdout, {});
  const spinner = _getSpinner();
  const renderInterval = setInterval(render, 250);
  function render() {
    log(`${spinner.getFrame()} ${action}`);
  }
  return {
    update: (text?: string) => {
      if (typeof text === 'string') {
        action = text;
      }
      render();
    },
    done: () => {
      log(`${title} ✔`);
      log.done();
      clearInterval(renderInterval);
    },
  };
}

export function _getSpinner() {
  const spinnerFrames = ['-', '\\', '|', '/'];
  let spinnerIndex = 0;
  function updateSpinnerIndex() {
    if (spinnerIndex === spinnerFrames.length - 1) {
      spinnerIndex = 0;
    } else {
      spinnerIndex++;
    }
  }
  return {
    getFrame() {
      const frame = spinnerFrames[spinnerIndex];
      updateSpinnerIndex();
      return frame;
    },
  };
}
