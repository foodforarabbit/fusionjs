import ServerAtreyu from './server';
import BrowserAtreyu from './browser';
// eslint-disable-next-line import/no-named-default
import {default as AtreyuMocker} from './mock';

export default (__NODE__ ? ServerAtreyu : BrowserAtreyu);
export const AtreyuMockPlugin = __NODE__ ? AtreyuMocker : BrowserAtreyu;

export {AtreyuToken, AtreyuConfigToken, AtreyuOptionsToken} from './server';
