// @flow

import os from 'os';
import stringify from 'json-stringify-safe';
import chalk from 'chalk';

const host = os.hostname();

export default function formatStdout(
  payload: {
    level: string,
    message: string,
    meta?: any,
  },
  isProduction?: boolean
) {
  const {level, message, meta} = payload;
  const date = new Date();
  const iso = date.toISOString();
  const ts = date.getTime();

  if (isProduction) {
    // format for kafka
    const data = {
      host,
      level,
      ts,
      iso,
      msg: message,
      fields: meta,
    };
    return stringify(data);
  } else {
    // format for terminal
    const levelColor = {
      error: chalk.red,
      fatal: chalk.redBright,
      warn: chalk.yellow,
      info: chalk.cyan,
      debug: chalk.gray,
      silly: chalk.gray,
      verbose: chalk.gray,
      trace: chalk.blue,
      access: chalk.magenta,
    };

    const colorize = (__DEV__ && levelColor[level]) || (v => v);
    const levelString = colorize(level) + ':    '.slice(0, 7 - level.length);
    const metaString = meta ? prettify(meta) : '';
    return `${iso} - ${levelString}${message} ${metaString}`;
  }
}

export function prettify(obj: any) {
  let arr = [];
  if (typeof obj === 'string') {
    return obj;
  }
  // using `for in` instead of `Object.entries` for perf because this will be called many times
  for (let p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      const val = obj[p];
      arr.push(`${p}=${val && typeof val === 'object' ? '<obj>' : val}`);
    }
  }
  return arr.join(', ');
}
