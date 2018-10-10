// @flow
import React from 'react';

import invariant from 'invariant';
import {createRouteFromReactElement, makePath} from './RouteUtils';

export class RedirectV3 extends React.Component {
  render() {
    invariant(
      false,
      '<RedirectV3> elements are for router configuration only and should not be rendered'
    );
    return null;
  }
}

RedirectV3.createRouteFromReactElement = function(element, parentRoute) {
  if (parentRoute) {
    const {from, to} = element.props;
    const elementWithNormalizedPath = React.cloneElement(element, {
      _redirect: true,
      path: makePath(parentRoute.path, from),
      to: makePath(parentRoute.path, to),
      exact: true,
    });
    return createRouteFromReactElement(elementWithNormalizedPath);
  } else {
    invariant(
      false,
      'An <RedirectV3> does not make sense at the root of your route config'
    );
  }
};
