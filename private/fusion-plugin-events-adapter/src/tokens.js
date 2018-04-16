// @flow
/* eslint-env browser */
import {createToken} from 'fusion-core';

const EventsAdapterToken = createToken('EventAdapterToken');
const EventsAdapterAnalyticsToken = createToken('EventsAdapterAnalyticsToken');

export {EventsAdapterToken, EventsAdapterAnalyticsToken};
