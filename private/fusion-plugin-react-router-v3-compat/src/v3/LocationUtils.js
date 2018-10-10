// @flow
// Unchanged: https://github.com/ReactTraining/history/blob/v3/modules/LocationUtils.js
import {parsePath} from './PathUtils';

export const createLocation = (input = '/', action = 'POP', key = null) => {
  const object = typeof input === 'string' ? parsePath(input) : input;

  const pathname = object.pathname || '/';
  const search = object.search || '';
  const hash = object.hash || '';
  const state = object.state;

  return {
    pathname,
    search,
    hash,
    state,
    action,
    key,
  };
};
