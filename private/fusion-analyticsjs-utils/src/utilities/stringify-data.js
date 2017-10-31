'use strict';

import isEmpty from './is-empty';

/**
 * Checks if given variable is an object
 * @param {Object} myVar - variable to check
 * @returns {Boolean} - is variable an object
 */
function _isObject(myVar) {
  return Object.prototype.toString.call(myVar) === '[object Object]';
}

/**
 * Converts any given value into a string.
 * @param {Object} value - any value to convert
 * @returns {String} - string value of the value
 */
function _stringifyValue(value) {
  if (isEmpty(value)) {
    return '';
  } else if (_isObject(value)) {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Checks if given variable is undefined/null
 * @param {Array} arr - array to transform
 * @returns {Array} - new array with stringified values
 */
function _stringifyArray(arr) {
  return arr.map(function iterate(item) {
    return _stringifyValue(item);
  });
}

/**
 * Convert given object to a flat object with just strings and arrays
 * @param {Object} obj - obj to string-ify values
 * @returns {Object} - new flattened obj with strings and array values
 */
function _stringifyData(obj) {
  return Object.keys(obj).reduce(function iterate(newObj, key) {
    var value = obj[key];

    if (Array.isArray(value)) {
      newObj[key] = _stringifyArray(value);
    } else if (_isObject(value)) {
      newObj[key] = _stringifyData(value);
    } else {
      newObj[key] = _stringifyValue(value);
    }

    return newObj;
  }, {});
}

export default _stringifyData;
