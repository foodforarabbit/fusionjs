// @flow
// TODO: true types

import justExtend from 'just-extend';
import dottie from 'dottie';

import {safePostMessage} from './utils/safe-post-message';

import type {ServiceAnalyticsConfig} from './types';
import type {EventContext} from './event-context';

export class EventHub {
  analyticsConfig: ServiceAnalyticsConfig;
  eventContext: EventContext;
  destinations: Object;
  constructor({analyticsConfig, eventContext, destinations}: Object) {
    this.analyticsConfig = justExtend(true, {}, analyticsConfig);
    this.eventContext = eventContext;
    this.destinations = destinations;
  }
  prepareSchemes(dispachPlan: Object) {
    const {schemes} = this.analyticsConfig;
    if (!dispachPlan.preparedScheme) {
      dispachPlan.preparedScheme = {};
      if (dispachPlan.schemes) {
        dispachPlan.preparedScheme = dispachPlan.schemes.reduce(
          (acc, schemeKey) => {
            return justExtend(true, acc, schemes[schemeKey]);
          },
          {}
        );
      }
    }
  }
  resolveScheme(scheme: Object, eventContext: Object) {
    function _resolve(x: number | string | Object) {
      if (typeof x === 'object') {
        if (x._interpolatable) {
          if (x.type === 'ref') {
            let resolvedValue = dottie.get(eventContext, x.value);
            return typeof resolvedValue === 'boolean' ||
              typeof resolvedValue === 'number'
              ? resolvedValue.toString()
              : resolvedValue;
          }
        }
        for (let k in x) {
          x[k] = _resolve(x[k]);
        }
      }
      return x;
    }
    return _resolve(justExtend(true, {}, scheme));
  }

  dispatch({
    eventKey,
    eventPayload,
    contextOverride,
  }: {
    eventKey: string,
    eventPayload?: Object,
    contextOverride?: Object,
  }) {
    safePostMessage(
      {
        type: 'fusion-plugin-web-analytics.dispatch',
        eventKey,
        eventPayload,
        _eventContext: this.eventContext.getCurrent(
          eventPayload,
          contextOverride
        ),
      },
      '*'
    );

    const {events} = this.analyticsConfig;
    if (events[eventKey]) {
      if (events[eventKey].destinations) {
        for (let destinationKey in events[eventKey].destinations) {
          const destinationPlan = events[eventKey].destinations[destinationKey];
          destinationPlan.forEach(dispatchPlan => {
            this.destinationDispatch({
              eventKey,
              destinationKey,
              dispatchPlan,
              eventPayload,
              contextOverride,
            });
          });
        }
      }
    }
  }
  destinationDispatch({
    eventKey,
    destinationKey,
    dispatchPlan,
    eventPayload,
    contextOverride,
  }: {
    eventKey: string,
    destinationKey: string,
    dispatchPlan: Object,
    eventPayload?: Object,
    contextOverride?: Object,
  }) {
    if (this.destinations[destinationKey]) {
      const $destination = this.destinations[destinationKey];
      this.prepareSchemes(dispatchPlan);
      const {preparedScheme, method} = dispatchPlan;
      const eventContext = this.eventContext.getCurrent(
        eventPayload,
        contextOverride
      );
      const dispatchValue = this.resolveScheme(preparedScheme, eventContext);

      safePostMessage(
        {
          type: 'fusion-plugin-web-analytics.destinationDispatch',
          eventKey,
          destinationKey,
          dispatchValue,
        },
        '*'
      );

      try {
        $destination.service[method](dispatchValue, {eventKey});
      } catch (e) {
        // TODO improve error handling
      }
    }
  }
}
