// @flow
'use strict';

/**
 * Checks if given variable is undefined/null
 * @param {Object} myVar - object to check
 * @returns {Boolean} - is empty object
 */
function _isEmpty(myVar: void | mixed): boolean %checks {
  return typeof myVar === 'undefined' || myVar === null || myVar.length === 0;
}

export default _isEmpty;
