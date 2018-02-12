// @flow
import UberServerErrorHandler from './server';
import UberBrowserErrorHandler from './browser';

declare var __NODE__: Boolean;
export default (__NODE__ ? UberServerErrorHandler : UberBrowserErrorHandler);
