// @flow
import {spawn} from 'child_process';
import {getSpinner} from './progress';

export function exec(
  command: string,
  title: string,
  options: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    const spinner = getSpinner(title);
    const split = command.split(' ');
    const child = spawn(split.shift(), split, {
      stdio: 'pipe',
      cwd: process.cwd(),
      ...options,
    });
    const stderr = [];
    child.stderr.on('data', data => {
      stderr.push(data.toString());
    });
    child.stdout.on('data', data => {
      spinner.update(data.toString());
    });
    child.on('error', e => {
      spinner.done();
      reject(e);
    });
    child.on('exit', code => {
      spinner.done();
      if (code === 0) {
        return resolve();
      }
      // eslint-disable-next-line no-console
      console.error(stderr.join('\n'));
      return reject(new Error(`Command: ${command} exited with code ${code}`));
    });
  });
}
