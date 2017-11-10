/* eslint-env browser */
import {Plugin} from 'fusion-core';
import jsCookie from 'js-cookie';

function safeJSONParse(str) {
  try {
    return JSON.parse(str) || {};
  } catch (e) {
    return {};
  }
}

export default ({cookieType, Cookies = jsCookie}) => {
  if (!cookieType) {
    throw new Error('AnalyticsSessionPlugin requires a valid cookieType.');
  }
  return new Plugin({
    Service: class AnalyticsSession {
      constructor() {
        return safeJSONParse(Cookies.get(cookieType.name));
      }
    },
  });
};
