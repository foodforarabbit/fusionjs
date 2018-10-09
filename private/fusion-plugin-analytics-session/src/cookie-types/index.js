// @flow
/* eslint-env browser */
import uuidv4 from 'uuid/v4';

export const UUID = __NODE__ ? Symbol('UUID') : 'UUID';
export const TIME_STAMP = __NODE__ ? Symbol('TIME_STAMP') : 'TIME_STAMP';

function _val(sym) {
  switch (sym) {
    case UUID:
      return uuidv4();
    case TIME_STAMP:
      return Date.now();
  }
}

export function generateCookieData(cookieType) {
  const cookie = {...cookieType.data};
  for (let key in cookie) {
    cookie[key] = _val(cookie[key]);
  }
  return cookie;
}
