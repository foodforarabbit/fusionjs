// @flow
import {GoogleAnalytics} from './google-analytics/browser';
import {Tealium} from './tealium/browser';
import {M3Emitter} from './m3/browser';
import {HPEventWebEmitter} from './hp-event-web/browser';

export const DestinationsMap = {
  googleAnalytics: GoogleAnalytics,
  tealium: Tealium,
  m3: M3Emitter,
  'web-heatpipe': HPEventWebEmitter,
};
