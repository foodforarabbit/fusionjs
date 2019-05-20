// @flow
/* eslint-env browser */

type PageDataType = {|
  host: ?string,
  href: ?string,
  pathname: ?string,
  referrer: string,
  title: string,
  url: ?string,
|};

/**
 * Extracts page related data from window/document
 * @returns {Object} - page data
 */
function getPageData(): PageDataType {
  var location = window.location || {};

  return {
    host: location.hostname,
    href: location.href,
    pathname: location.pathname,
    referrer: document.referrer,
    title: document.title,
    url: location.href,
  };
}

export default getPageData;
