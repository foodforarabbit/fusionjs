// @flow
import {ProvidedHOC} from 'fusion-react';
import {GoogleAnalyticsToken} from '@uber/fusion-plugin-google-analytics';

export default ProvidedHOC.create(
  'googleAnalytics',
  undefined,
  GoogleAnalyticsToken
);
