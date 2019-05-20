// @flow
'use strict';

import isEmpty from './is-empty';

/**
 * Removes empty items in a given array
 * @param {Array} arr - array to process
 * @returns {Array} - new compact array
 */
function _compactArray(arr: Array<mixed | void>): Array<mixed> {
  return arr.filter(function filter(item: mixed): boolean {
    return !isEmpty(item);
  });
}

export default _compactArray;
