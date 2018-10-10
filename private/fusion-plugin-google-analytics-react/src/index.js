// @flow
/* eslint-env browser */
import plugin from './plugin';
import withGoogleAnalytics from './hoc';

import {
  GoogleAnalyticsToken,
  GoogleAnalyticsConfigToken,
} from '@uber/fusion-plugin-google-analytics';

export {GoogleAnalyticsToken, GoogleAnalyticsConfigToken};

export default plugin;
export {withGoogleAnalytics};
