/* eslint-env node */
import {
  addDirectives,
  addSourceToAssetDirectives,
} from './policies/policy-utils';
import analyticsOverrides from './analytics-overrides';
import koaHelmet from 'koa-helmet';
import Strict from './policies/strict';
import UberDefault from './policies/uber-default';
import url from 'url';

function tryCleanUrl(dirtyUrl) {
  if (!dirtyUrl) {
    return dirtyUrl;
  }
  // Strip the url of any paths, etc.
  const parsedUrl = url.parse(dirtyUrl);
  if (!parsedUrl.host) {
    // If there is no host, we likely have a malformed url
    // (without a protocol) that we couldn't parse.
    // In this case, trust that the format is correct and just return the url as given.
    return dirtyUrl;
  }
  return parsedUrl.protocol + (parsedUrl.slashes ? '//' : '') + parsedUrl.host;
}

export default function buildCSPMiddleware({ctx, config, cspFlipr}) {
  const {serviceName} = config;
  const {
    overrides,
    reportUri,
    intentionallyRemoveAllSecurity,
    useStrictDynamicMode,
    allowInsecureContent,
    allowMixedContent,
    assetBase,
    cdnBase,
    analyticsServiceNames,
  } =
    config.csp || {};

  function shouldUseReportOnlyMode() {
    if (typeof intentionallyRemoveAllSecurity !== 'undefined') {
      return Boolean(intentionallyRemoveAllSecurity);
    }
    if (serviceName && cspFlipr) {
      const reportOnly = cspFlipr.get(`${serviceName}.report_only`);
      return Boolean(reportOnly);
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

    if (assetBase) {
      policy = addSourceToAssetDirectives(policy, tryCleanUrl(assetBase));
    }
    if (cdnBase && cdnBase !== assetBase) {
      policy = addSourceToAssetDirectives(policy, tryCleanUrl(cdnBase));
    }

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
