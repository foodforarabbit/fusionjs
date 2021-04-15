// @flow
/* eslint-env node */
import {html} from 'fusion-core';

import type {Context} from 'fusion-core';

export function setupGoogleAnalytics({ctx}: {ctx: Context}) {
  const escaped = html`
    <script async src="https://www.google-analytics.com/analytics.js"></script>
  `;
  ctx.template.head.push(escaped);
}
