/* eslint-env browser */
import {createToken} from 'fusion-tokens';

const EventsAdapterToken = createToken('EventAdapterToken');
const EventsAdapterServiceNameToken = createToken(
  'EventsAdapterServiceNameToken'
);
const EventsAdapterAnalyticsToken = createToken('EventsAdapterAnalyticsToken');

export {
  EventsAdapterToken,
  EventsAdapterServiceNameToken,
  EventsAdapterAnalyticsToken,
};
