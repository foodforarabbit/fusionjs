/* eslint-env node */
import {addDirectives} from './policies/policy-utils';
import analyticsOverrides from './analytics-overrides';
import koaHelmet from 'koa-helmet';
import Strict from './policies/strict';
import UberDefault from './policies/uber-default';

export default function buildCSPMiddleware({ctx, config}) {
  const {serviceName} = config;
  const {
    overrides,
    reportUri,
    intentionallyRemoveAllSecurity,
    useStrictDynamicMode,
    allowInsecureContent,
    allowMixedContent,
    analyticsServiceNames,
  } =
    config.csp || {};

  function shouldUseReportOnlyMode() {
    if (typeof intentionallyRemoveAllSecurity !== 'undefined') {
      return Boolean(intentionallyRemoveAllSecurity);
    }
    return false;
  }

  function getDynamicReportUri() {
    if (reportUri) {
      return reportUri.replace(
        /ro=(true|false)/,
        `ro=${shouldUseReportOnlyMode()}`
      );
    }
    if (serviceName) {
      return `https://csp.uber.com/csp?a=${
        serviceName
      }&ro=${shouldUseReportOnlyMode()}`;
    }
    return `https://csp.uber.com/csp?a=unknown&ro=${shouldUseReportOnlyMode()}`;
  }

  let policy = {};

  if (useStrictDynamicMode) {
    policy = Strict(`'nonce-${ctx.nonce}'`);
  } else {
    policy = UberDefault(`'nonce-${ctx.nonce}'`);

    // We are adding google analytics by default now
    const analyticsKeys = analyticsServiceNames || [];
    if (!analyticsKeys.includes('googleAnalytics')) {
      analyticsKeys.push('googleAnalytics');
    }
    policy = addDirectives(policy, overrides || {});
    policy = analyticsKeys.reduce(function perService(p, analyticsServiceName) {
      return addDirectives(p, analyticsOverrides[analyticsServiceName] || {});
    }, policy);

    if (allowInsecureContent || allowMixedContent) {
      delete policy.blockAllMixedContent;
    }
  }

  policy.reportUri = getDynamicReportUri;

  return koaHelmet.contentSecurityPolicy({
    directives: policy,
    reportOnly: shouldUseReportOnlyMode,
    setAllHeaders: false,
    browserSniff: true,
  });
}
