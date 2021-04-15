// @flow
import * as React from 'react';
import {withServices} from 'fusion-react';
import isObject from 'isobject';
import {UberWebAnalyticsToken} from './tokens';

import type {WebAnalyticsPluginServiceType} from './types';

const DATA_TRACKING_PAYLOAD_KEY = 'data-tracking-payload';
const DATA_TRACKING_NAME_KEY = 'data-tracking-name';
const DATA_SKIP_TRACKING_KEY = 'data-skip-tracking';

function getTargetElement(element, targetElementTags) {
  while (
    !targetElementTags.includes(element && element.tagName) &&
    element.parentElement
  ) {
    element = element.parentElement;
  }

  return targetElementTags.includes(element && element.tagName)
    ? element
    : null;
}

function getEventData(targetElement) {
  const trackingPathArr = [];
  let trackingPayload = {};
  let currentTarget = targetElement;

  while (currentTarget && currentTarget.parentElement) {
    const currentTrackingId = currentTarget.getAttribute(
      DATA_TRACKING_NAME_KEY
    );
    const currentPayload = currentTarget.getAttribute(
      DATA_TRACKING_PAYLOAD_KEY
    );

    if (currentTrackingId) {
      trackingPathArr.unshift(currentTrackingId);
    }
    if (currentPayload) {
      try {
        const parsedCurrentPayload = JSON.parse(currentPayload);
        trackingPayload = {
          ...parsedCurrentPayload,
          ...trackingPayload,
        };
      } catch (e) {
        throw new Error('[Web Analytics] error parsing payload');
      }
    }

    currentTarget = currentTarget.parentElement;
  }

  if (currentTarget && currentTarget.getAttribute(DATA_TRACKING_NAME_KEY)) {
    trackingPathArr.unshift(currentTarget.getAttribute(DATA_TRACKING_NAME_KEY));
  }

  return {
    eventNamePath: trackingPathArr.join('.'),
    eventPayload: trackingPayload,
  };
}

function _DOMEventsTracker(props: {
  analyticsService: WebAnalyticsPluginServiceType,
  as?: React.ElementType,
  className?: string,
  config?: {[string]: Array<string>},
  eventPayload?: Object,
  children?: React.Node,
}) {
  const config = props.config || {
    onClick: ['A', 'BUTTON'],
  };

  function createHandler({eventType}) {
    return function handler(event) {
      if (config[eventType]) {
        const targetElementTags = config[eventType];
        const targetElement = getTargetElement(event.target, targetElementTags);

        if (
          !targetElement ||
          (targetElement && targetElement.getAttribute(DATA_SKIP_TRACKING_KEY))
        ) {
          return;
        }

        const {eventNamePath, eventPayload} = getEventData(targetElement);
        const eventName = `${event.type}.${eventNamePath}`;
        const finalPayload = {
          ...props.eventPayload,
          ...eventPayload,
        };

        props.analyticsService.track(eventName, finalPayload);
      }
    };
  }

  function createHandlers() {
    let handlers = {};
    for (let k in config) {
      handlers[k] = createHandler({eventType: k});
    }
    return handlers;
  }

  const CaptureElementType: string | React$AbstractComponent<any, any> =
    props.as || 'div';
  const propsClassName = props.className ? ` ${props.className}` : '';
  const captureElementClassName = 'uwa-capture' + propsClassName;
  return (
    <CaptureElementType
      className={captureElementClassName}
      {...createHandlers()}
    >
      {typeof props.children === 'function'
        ? props.children({
            analyticsService: props.analyticsService,
            getEventData,
            eventPayload: props.eventPayload,
          })
        : props.children}
    </CaptureElementType>
  );
}

export const serializePayload = function(payload: Object) {
  if (!isObject(payload)) {
    throw new Error('[Web Analytics] passed payload is not an object');
  }

  try {
    return JSON.stringify(payload);
  } catch (e) {
    throw new Error('[Web Analytics] payload is not valid JSON');
  }
};

export const DOMEventsTracker = withServices({
  analyticsService: UberWebAnalyticsToken,
})(_DOMEventsTracker);
