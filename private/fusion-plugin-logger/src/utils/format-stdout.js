// @flow

import os from 'os';

const host = os.hostname();

export default function formatStdout(
  payload: {
    level: string,
    message: string,
    meta?: any,
  },
  env: ?string
) {
  const {level, message, meta} = payload;
  const date = new Date();
  const iso = date.toISOString();
  const ts = date.getTime();

  if (env && env == 'production') {
    // format for kafka
    const data = {
      host,
      level,
      ts,
      iso,
      msg: message,
      fields: meta,
    };
    return JSON.stringify(data);
  } else {
    // format for terminal
    const levelString = (level + ':    ').slice(0, 7);
    const metaString = meta ? JSON.stringify(meta) : '';
    return `${iso} - ${levelString}${message} ${metaString}`;
  }
}
