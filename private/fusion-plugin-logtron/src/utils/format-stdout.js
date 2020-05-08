// @flow

import os from 'os';
import stringify from 'json-stringify-safe';

const MAX_LOG_DATA = 3000;
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
    let toText = stringify(data);
    if (toText.length > MAX_LOG_DATA) {
      toText = `${toText.slice(0, MAX_LOG_DATA)}...`;
    }
    return toText;
  } else {
    // format for terminal
    const levelString = (level + ':    ').slice(0, 7);
    const metaString = meta ? prettify(meta) : '';
    return `${iso} - ${levelString}${message} ${metaString}`;
  }
}

export function prettify(obj: any) {
  let arr = [];
  // using `for in` instead of `Object.entries` for perf because this will be called many times
  for (let p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      const val = obj[p];
      arr.push(`${p}=${val && typeof val === 'object' ? '<obj>' : val}`);
    }
  }
  return arr.join(', ');
}
