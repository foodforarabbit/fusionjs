import UberServerErrorHandler from './server';
import UberBrowserErrorHandler from './browser';

export default (__NODE__ ? UberServerErrorHandler : UberBrowserErrorHandler);
