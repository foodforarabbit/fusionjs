'use strict';

import isEmpty from './is-empty';

/**
 * Removes empty items in a given array
 * @param {Array} arr - array to process
 * @returns {Array} - new compact array
 */
function _compactArray(arr) {
  return arr.filter(function filter(item) {
    return !isEmpty(item);
  });
}

export default _compactArray;
