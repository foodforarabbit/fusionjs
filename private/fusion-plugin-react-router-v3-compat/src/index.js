// @flow
import Plugin from './plugin';
import {createRouter4Compat} from './Router4Compat';

import {RouteV3} from './v3/RouteV3';
import {IndexRouteV3} from './v3/IndexRouteV3';
import {RedirectV3} from './v3/RedirectV3';
import {IndexRedirectV3} from './v3/IndexRedirectV3';

const {Router4Compat, browserHistoryCompat} = createRouter4Compat();

export {Router4Compat, browserHistoryCompat};
export {RouteV3, IndexRouteV3, RedirectV3, IndexRedirectV3};

export default Plugin;
