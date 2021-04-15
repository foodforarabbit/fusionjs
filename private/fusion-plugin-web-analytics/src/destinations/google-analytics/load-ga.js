/* eslint-disable */
export default function googleAnalytics(): any {
  // Google - https://developers.google.com/analytics/devguides/collection/analyticsjs
  /* istanbul ignore next */
  window.ga =
    window.ga ||
    function() {
      (ga.q = ga.q || []).push(arguments);
    };
  ga.l = +new Date();
}
