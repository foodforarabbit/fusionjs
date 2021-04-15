// @flow
/* eslint-env browser */
import {
  cleanData,
  getPageData,
  stringifyData,
} from '@uber/fusion-analyticsjs-utils';

export class Tealium {
  _userId: string;
  config: any;

  constructor({config}: {config: Object}) {
    this.config = config;
  }

  identify(id: string) {
    this._userId = id;
  }

  track(data: any) {
    let payload = {
      ...data,
      userId: data.userId || this._userId,
    };

    // Tealium is async, handle the race condition
    if (!window.utag || !window.utag.link) {
      return;
    }

    // Note: Tealium requires all values to be strings.
    payload = stringifyData(cleanData(payload));

    window.utag.link(payload);
  }

  pageview({title, page, data}: {title?: string, page?: string, data?: any}) {
    data = data || {};
    // Tealium is async, handle the race condition
    if (!window.utag || !window.utag.view) {
      return;
    }

    const pageData = getPageData();
    let payload = Object.assign(
      {
        title: title || pageData.title,
        page: page || pageData.pathname,
      },
      data
    );

    // Note: Tealium requires all values to be strings.
    payload = stringifyData(cleanData(payload));

    window.utag.view(payload);
  }
}
