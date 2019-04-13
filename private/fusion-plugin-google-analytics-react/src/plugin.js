// @flow
import GoogleAnalyticsPlugin from '@uber/fusion-plugin-google-analytics';
import {ProviderPlugin} from 'fusion-react';

// Typed as any as GoogleAnalyticsPlugin does not yet export types.
export default ProviderPlugin.create<any, any>(
  'googleAnalytics',
  GoogleAnalyticsPlugin
);
