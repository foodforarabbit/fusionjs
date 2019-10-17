// @flow

import {writeFileSync} from 'fs';
import os from 'os';
import path from 'path';

export default (config: Object) => {
  const tmpDir = os.tmpdir();
  try {
    writeFileSync(
      path.resolve(tmpDir, `${config.serviceName}.json`),
      JSON.stringify(config)
    );
  } catch (e) {
    // Do nothing if the write failed
    // Writing a config file isn't a requirement, it's just a nice to have
  }
};
