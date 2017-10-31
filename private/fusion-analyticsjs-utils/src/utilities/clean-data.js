'use strict';

import isEmpty from './is-empty';

/**
 * Removes empty strings, null, and undefined values from an object
 * @param {Object} data - data to clean
 * @returns {Object} - clean data
 */
function _cleanData(data) {
  return Object.keys(data).reduce(function iterate(cleanedObj, key) {
    var value = data[key];

    if (isEmpty(value)) {
      delete cleanedObj[key];
    } else if (typeof value === 'object') {
      cleanedObj[key] = _cleanData(value);
    }

    return data;
  }, {});
}

export default _cleanData;
