// @flow
/* eslint-env browser */
import uuidv4 from 'uuid/v4';
import mapValues from 'just-map-values';

import type {CookieTypeType} from '../types';

export const CookieDataTypes = {
  UUID: __NODE__ ? Symbol('UUID') : 'UUID',
  TIME_STAMP: __NODE__ ? Symbol('TIME_STAMP') : 'TIME_STAMP',
};

function _val(sym) {
  if (!sym) return;
  switch (sym) {
    case CookieDataTypes.UUID:
      return uuidv4();
    case CookieDataTypes.TIME_STAMP:
      return Date.now();
  }
  // $FlowFixMe
  if (typeof sym === 'symbol') {
    return sym.toString();
  }
  return sym;
}

export function generateCookieData(cookieType: CookieTypeType) {
  function _gen(cookieTypeDataScheme) {
    return typeof cookieTypeDataScheme === 'object'
      ? mapValues(cookieTypeDataScheme, v => _gen(v))
      : _val(cookieTypeDataScheme);
  }
  return _gen(cookieType.data);
}
