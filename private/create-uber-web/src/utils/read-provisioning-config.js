// @flow

import {readFileSync} from 'fs';
import os from 'os';
import path from 'path';

export default (serviceName: string) => {
  const tmpDir = os.tmpdir();
  try {
    const data = readFileSync(path.resolve(tmpDir, `${serviceName}.json`), {
      encoding: 'utf8',
    });
    const parsed = JSON.parse(data);
    return parsed;
  } catch (e) {
    return '';
  }
};
