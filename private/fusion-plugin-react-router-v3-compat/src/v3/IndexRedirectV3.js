import React from 'react';

import invariant from 'invariant';
import {makePath} from './RouteUtils';
import {RedirectV3} from './RedirectV3';

/**
 * An <IndexRedirect> is used to specify its parent's <Route indexRedirect> in
 * a JSX route config.
 */
/* eslint-disable react/require-render-return */
export class IndexRedirectV3 extends React.Component {
  render() {
    invariant(
      false,
      '<IndexRedirectV3> elements are for router configuration only and should not be rendered'
    );
  }
}

IndexRedirectV3.createRouteFromReactElement = function(element, parentRoute) {
  if (parentRoute) {
    const indexRedirect = RedirectV3.createRouteFromReactElement(
      element,
      parentRoute
    );
    indexRedirect.path = makePath(parentRoute.path, indexRedirect.path);
    indexRedirect.exact = true;
    parentRoute.indexRedirect = indexRedirect;
  } else {
    invariant(
      false,
      'An <IndexRedirectV3> does not make sense at the root of your route config'
    );
  }
};
