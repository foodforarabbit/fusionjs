// @flow

import fs from 'fs';
import util from 'util';

const exists = util.promisify(fs.exists);
export default async function isFile(file: string): Promise<boolean> {
  return await exists(file);
}
