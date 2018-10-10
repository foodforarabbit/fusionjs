// @flow
const REQUIRED_CSP_CONTENT_TYPES = ['text/html', 'image/svg'];
const CSP_HEADERS = [
  'Content-Security-Policy',
  'Content-Security-Policy-Report-Only',
  'X-Content-Security-Policy',
  'X-Content-Security-Policy-Report-Only',
  'X-WebKit-CSP',
  'X-WebKit-CSP-Report-Only',
];

export {REQUIRED_CSP_CONTENT_TYPES, CSP_HEADERS};
