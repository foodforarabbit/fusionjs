// @flow
'use strict';

import isEmpty from './is-empty';

/**
 * Checks if given variable is an object
 * @param {Object} myVar - variable to check
 * @returns {Boolean} - is variable an object
 */
function _isObject(myVar: mixed): boolean {
  return Object.prototype.toString.call(myVar) === '[object Object]';
}

/**
 * Converts any given value into a string.
 * @param {Object} value - any value to convert
 * @returns {String} - string value of the value
 */
function _stringifyValue(value: mixed): string {
  if (isEmpty(value)) {
    return '';
  } else if (_isObject(value)) {
    const typedVal: {} = (value: any);
    return JSON.stringify(typedVal);
  }
  return String(value);
}

/**
 * Converts any given array into an Array<string>
 * @param {Array} arr - array to transform
 * @returns {Array} - new array with stringified values
 */
function _stringifyArray(arr: Array<mixed>): Array<string> {
  return arr.map(function iterate(item: mixed): string {
    return _stringifyValue(item);
  });
}

type StringifiedObjType = {
  [string]: string | Array<string> | StringifiedObjType,
};

/**
 * Convert given object to a stringified object (i.e. all properties match to
 * string, Array<string> or a stringified object).
 * @param {Object} obj - obj to string-ify values
 * @returns {Object} - new flattened obj with strings and array values
 */
function _stringifyData(obj: {[string]: mixed}): StringifiedObjType {
  return Object.keys(obj).reduce(function iterate(
    newObj: StringifiedObjType,
    key: string
  ): StringifiedObjType {
    var value = obj[key];

    if (Array.isArray(value)) {
      const typedArr: Array<mixed> = (value: any); // override $ReadOnlyArray<mixed>
      newObj[key] = _stringifyArray(typedArr);
    } else if (_isObject(value)) {
      const typedObj: {[string]: mixed} = (value: any); // manually refine type to Object
      newObj[key] = _stringifyData(typedObj);
    } else {
      newObj[key] = _stringifyValue(value);
    }

    return newObj;
  },
  {});
}

export default _stringifyData;
