/* @flow */

import {withTextFile} from '@dubstep/core';
import nunjucks from 'nunjucks';

export const replaceNunjucksFile = async (
  file: string,
  interpolations: {[string]: string | number | boolean}
) => {
  await withTextFile(file, data => {
    return nunjucks.renderString(data, interpolations);
  });
};
