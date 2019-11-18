// @flow
import {withServices} from 'fusion-react';
import {GoogleAnalyticsToken} from '@uber/fusion-plugin-google-analytics';

export const withGoogleAnalytics = withServices({
  googleAnalytics: GoogleAnalyticsToken,
});
