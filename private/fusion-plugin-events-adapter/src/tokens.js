// @flow
/* eslint-env browser */
import {createToken} from 'fusion-core';
import type {
  EventsAdapterType,
  EventsAdapterAnalyticsType,
  EventsAdapterMiddlewareTimingAllowListType,
} from './types.js';

const EventsAdapterToken = createToken<EventsAdapterType>('EventAdapterToken');
const EventsAdapterAnalyticsToken = createToken<EventsAdapterAnalyticsType>(
  'EventsAdapterAnalyticsToken'
);
const EventsAdapterMiddlewareTimingAllowListToken = createToken<EventsAdapterMiddlewareTimingAllowListType>(
  'EventsAdapterMiddlewareTimingAllowListToken'
);

export {
  EventsAdapterToken,
  EventsAdapterAnalyticsToken,
  EventsAdapterMiddlewareTimingAllowListToken,
};
