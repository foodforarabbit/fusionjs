/* eslint-env browser */

/**
 * Extracts page related data from window/document
 * @returns {Object} - page data
 */
function getPageData() {
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
