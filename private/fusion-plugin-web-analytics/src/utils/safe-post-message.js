/* eslint-env browser */
// @flow

function removeNonClonables(obj) {
  for (let k in obj) {
    if (typeof obj[k] === 'object') {
      removeNonClonables(obj[k]);
    } else if (obj[k] instanceof Function || obj[k] instanceof Error) {
      delete obj[k];
    }
  }
}

export function safePostMessage(message: any, targetOrigin: string) {
  if (__BROWSER__) {
    try {
      window.postMessage(message, targetOrigin);
    } catch (e) {
      removeNonClonables(message);
      window.postMessage(message, targetOrigin);
    }
  }
}
