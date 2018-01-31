/* eslint-env browser */
import {createToken, createOptionalToken} from 'fusion-tokens';

const EventsAdapterToken = createToken('EventAdapterToken');
const EventsAdapterAnalyticsToken = createOptionalToken(
  'EventsAdapterAnalyticsToken',
  null
);

export {EventsAdapterToken, EventsAdapterAnalyticsToken};
