// @flow
import ServerAtreyu from './server';
import BrowserAtreyu from './browser';

declare var __NODE__: Boolean;
export default __NODE__ ? ServerAtreyu : BrowserAtreyu;
export {AtreyuToken, AtreyuConfigToken, AtreyuOptionsToken} from './tokens';
