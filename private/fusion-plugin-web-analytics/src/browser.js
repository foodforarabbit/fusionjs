// @flow
/* eslint-env browser */
import {createPlugin, unescape} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import {EventContext} from './event-context';
import {EventHub} from './event-hub';

import {DestinationsMap} from './destinations/browser';

import type {WebAnalyticsPluginType, ServiceAnalyticsConfig} from './types.js';

const noopConfig = {
  destinations: {},
  events: {},
  schemes: {},
  errors: [],
};

const plugin =
  __BROWSER__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
    },
    provides({events}) {
      class WebAnalytics {
        analyticsConfig: ServiceAnalyticsConfig;
        eventContext: EventContext;
        eventHub: EventHub;

        constructor() {
          this.analyticsConfig = noopConfig;

          const configElement = document.getElementById('__ANALYTICS_CONFIG__');
          try {
            if (configElement) {
              this.analyticsConfig = JSON.parse(
                unescape(configElement.textContent)
              );
            }
          } catch (e) {
            throw new Error('[Web Analytics] config parsing error');
          }

          // TODO: support analyticsState
          this.eventContext = new EventContext({window});

          this.eventHub = new EventHub({
            analyticsConfig: this.analyticsConfig,
            eventContext: this.eventContext,
            destinations: this.createDestinations(),
          });

          events.on('pageview:browser', pageviewEvent =>
            this.track('pageview', pageviewEvent)
          );
        }

        createDestinations() {
          const {destinations} = this.analyticsConfig;
          if (!destinations || Object.keys(destinations).length < 1) {
            return;
          }
          return Object.keys(destinations).reduce((acc, destKey) => {
            const {type: destType} = destinations[destKey];
            if (DestinationsMap[destType]) {
              acc[destKey] = {
                destType,
                service: new DestinationsMap[destType]({
                  events,
                  config: destinations[destKey].config || {},
                }),
              };
            }
            return acc;
          }, {});
        }

        track(
          eventKey: string,
          eventPayload?: Object,
          contextOverride?: Object
        ) {
          this.eventHub.dispatch({
            eventKey,
            eventPayload,
            contextOverride,
          });
        }
      }
      return new WebAnalytics();
    },
  });

export default ((plugin: any): WebAnalyticsPluginType);
