// @flow
import type {PayloadMetaType} from '../types.js';

export function createError(meta: PayloadMetaType) {
  const message = meta.message || 'unknown error occurred';
  const newErr = new Error(message);
  if (meta.stack) {
    newErr.stack = meta.stack;
  }
  return newErr;
}

export function isErrorLikeObject(obj: any) {
  if (!obj) {
    return false;
  }
  return obj.message && (obj.stack || (obj.source && obj.line));
}

export function isError(err: ?{}) {
  const errString = Object.prototype.toString.call(err);
  return errString === '[object Error]' || err instanceof Error;
}
