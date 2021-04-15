// @flow
/* eslint-env browser */

// Tealium or GA already captures most of the browser traits(e.g. viewport sizes)
// Add more when valid use-cases surface or when moving to server-side tracking

function simpleCookieParse(cookie) {
  return cookie
    ? cookie.split('; ').reduce((acc, item) => {
        const [k, v] = item.split('=');
        acc[k] = v;
        return acc;
      }, {})
    : {};
}

export function serializeWindowInfo(window: any) {
  if (!window) return {};
  return {
    document: {
      cookie:
        window.document && window.document.cookie
          ? simpleCookieParse(window.document.cookie)
          : [],
    },
    referrer: window.referrer,
    // TODO: parsed search and hash
  };
}
