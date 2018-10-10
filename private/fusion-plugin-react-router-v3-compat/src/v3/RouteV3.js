// @flow
// Modified: https://github.com/ReactTraining/react-router/blob/v3/modules/Route.js
import React from 'react';

import invariant from 'invariant';
import {createRouteFromReactElement, makePath} from './RouteUtils';

export class RouteV3 extends React.Component {
  render() {
    invariant(
      false,
      '<RouteV3> elements are for router configuration only and should not be rendered'
    );
    return null;
  }
}

RouteV3.createRouteFromReactElement = function(element, parentRoute) {
  if (parentRoute) {
    const {path: childPath} = element.props;
    const elementWithNormalizedPath = React.cloneElement(element, {
      path: makePath(parentRoute.path, childPath),
    });
    return createRouteFromReactElement(elementWithNormalizedPath);
  }
  return createRouteFromReactElement(element);
};
