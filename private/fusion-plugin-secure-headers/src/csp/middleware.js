// @flow
/* eslint-env node */
import koaHelmet from 'koa-helmet';

import {addDirectives} from './policies/policy-utils';
import analyticsOverrides from './analytics-overrides';
import Strict from './policies/strict';
import UberDefault from './policies/uber-default';
import type {Context} from 'fusion-core';
import type {CSPConfigType} from '../types.js';

export default function buildCSPMiddleware({
  ctx,
  serviceName,
  csp,
}: {
  ctx: Context,
  serviceName: string,
  csp: CSPConfigType,
}) {
  const {
    overrides,
    reportUri,
    intentionallyRemoveAllSecurity,
    useStrictDynamicMode,
    allowInsecureContent,
    allowMixedContent,
    analyticsServiceNames,
  } = csp || {};

  function shouldUseReportOnlyMode() {
    if (typeof intentionallyRemoveAllSecurity !== 'undefined') {
      return Boolean(intentionallyRemoveAllSecurity);
    }
    return false;
  }

  function getDynamicReportUri() {
    if (typeof reportUri === 'string') {
      return reportUri.replace(
        /ro=(true|false)/,
        `ro=${String(shouldUseReportOnlyMode())}`
      );
    }
    if (serviceName) {
      return `https://csp.uber.com/csp?a=${serviceName}&ro=${String(
        shouldUseReportOnlyMode()
      )}`;
    }
    return `https://csp.uber.com/csp?a=unknown&ro=${String(
      shouldUseReportOnlyMode()
    )}`;
  }

  let policy = {};

  if (useStrictDynamicMode) {
    policy = Strict(`'nonce-${ctx.nonce}'`);
  } else {
    policy = UberDefault(`'nonce-${ctx.nonce}'`);

    // We are adding Google Analytics by default now
    const analyticsKeys = analyticsServiceNames || [];
    if (!analyticsKeys.includes('googleAnalytics')) {
      analyticsKeys.push('googleAnalytics');
    }
    policy = addDirectives(policy, overrides || {});
    policy = analyticsKeys.reduce(function perService(p, analyticsServiceName) {
      return addDirectives(p, analyticsOverrides[analyticsServiceName] || {});
    }, policy);

    if (allowInsecureContent || allowMixedContent) {
      // $FlowFixMe
      delete policy.blockAllMixedContent;
    }
  }

  // $FlowFixMe
  policy.reportUri = getDynamicReportUri;

  return koaHelmet.contentSecurityPolicy({
    directives: policy,
    reportOnly: shouldUseReportOnlyMode,
    setAllHeaders: false,
    browserSniff: true,
  });
}
