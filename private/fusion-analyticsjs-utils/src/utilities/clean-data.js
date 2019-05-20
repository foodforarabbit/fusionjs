// @flow
'use strict';

import isEmpty from './is-empty';

/**
 * Removes empty strings, null, and undefined values from an object
 * @param {Object} data - data to clean
 * @returns {Object} - clean data
 */
function _cleanData(data: {[string]: mixed | void}): {[string]: mixed} {
  return Object.keys(data).reduce(function iterate(
    cleanedObj: {[string]: mixed | void},
    key: string
  ): {[string]: mixed} {
    var value = data[key];

    if (isEmpty(value)) {
      delete cleanedObj[key];
    } else if (typeof value === 'object') {
      cleanedObj[key] = _cleanData((value: any));
    }

    return data;
  },
  {});
}

export default _cleanData;
