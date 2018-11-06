// @flow
/* eslint-env browser */

// fork: https://github.com/js-cookie/js-cookie/blob/e94bbb5b119e397ea25864c4d917bbc97937d22d/src/js.cookie.js#L101-L140

function decode(s) {
  return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
}

export default class CookiesParser {
  rawCookie: string;

  constructor(rawCookie: string) {
    this.rawCookie = rawCookie;
  }

  get(key: string): ?Object {
    if (typeof this.rawCookie === 'undefined') {
      return {};
    }

    let jar = {};
    let cookies = this.rawCookie.split('; ');
    let i = 0;

    for (; i < cookies.length; i++) {
      let parts = cookies[i].split('=');
      let cookie = parts.slice(1).join('=');

      try {
        let name = decode(parts[0]);
        cookie = decode(cookie);

        try {
          cookie = JSON.parse(cookie);
        } catch (e) {
          cookie = {};
        }

        jar[name] = cookie;

        if (key === name) {
          break;
        }
      } catch (e) {
        void 0;
      }
    }

    return key ? jar[key] : jar;
  }
}
