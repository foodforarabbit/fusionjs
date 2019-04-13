// @flow
/* eslint-env browser */
import {createToken} from 'fusion-core';
import type {EventsAdapterType, EventsAdapterAnalyticsType} from './types.js';

const EventsAdapterToken = createToken<EventsAdapterType>('EventAdapterToken');
const EventsAdapterAnalyticsToken = createToken<EventsAdapterAnalyticsType>(
  'EventsAdapterAnalyticsToken'
);

export {EventsAdapterToken, EventsAdapterAnalyticsToken};
