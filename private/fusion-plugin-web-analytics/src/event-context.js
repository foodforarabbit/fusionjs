// @flow
/* eslint-env browser */
import {serializeWindowInfo} from './utils/serialize-window-info';

type contextSourcesType = {
  window?: any,
  analyticsState?: Object,
  redux?: Object,
};

export class EventContext {
  sources: contextSourcesType;

  constructor(contextSources: contextSourcesType) {
    this.sources = {redux: {}, ...contextSources};
  }
  setReduxState(state: Object) {
    this.sources.redux = state;
  }
  getCurrent(eventPayload?: Object, contextOverride?: Object) {
    return {
      window: serializeWindowInfo(this.sources.window),
      // anaylyticsState,
      payload: eventPayload,
      redux: {...this.sources.redux},
      ...contextOverride,
    };
  }
}
