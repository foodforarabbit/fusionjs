/* eslint-env browser */
import {
  cleanData,
  getPageData,
  stringifyData,
} from '@uber/fusion-analyticsjs-utils';
import {Plugin} from 'fusion-plugin';

// TODO: support setting UDO
export default function() {
  return new Plugin({
    Service: class Tealium {
      identify(id) {
        this._userId = id;
      }

      track(data) {
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

      pageview({title, page, data}) {
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
    },
  });
}
