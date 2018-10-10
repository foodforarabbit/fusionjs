// @flow
// Modified: https://github.com/ReactTraining/react-router/blob/v3/modules/IndexRoute.js
import React from 'react';

import invariant from 'invariant';
import {createRouteFromReactElement, makePath} from './RouteUtils';

/**
 * An <IndexRoute> is used to specify its parent's <Route indexRoute> in
 * a JSX route config.
 */
/* eslint-disable react/require-render-return */
export class IndexRouteV3 extends React.Component {
  render() {
    invariant(
      false,
      '<IndexRouteV3> elements are for router configuration only and should not be rendered'
    );
  }
}

IndexRouteV3.createRouteFromReactElement = function(element, parentRoute) {
  if (parentRoute) {
    const indexRoute = createRouteFromReactElement(element);
    indexRoute.path = makePath(parentRoute.path, indexRoute.path);
    indexRoute.exact = true;
    parentRoute.indexRoute = indexRoute;
  } else {
    invariant(
      false,
      'An <IndexRouteV3> does not make sense at the root of your route config'
    );
  }
};
