// @flow
import {createToken} from 'fusion-core';

/*::
import Atreyu from '@uber/atreyu';
type AtreyuType = typeof Atreyu;
*/

export const AtreyuToken = createToken<AtreyuType>('AtreyuToken');
export const AtreyuConfigToken = createToken<Object>('AtreyuConfigToken');
export const AtreyuOptionsToken = createToken<Object>('AtreyuOptionsToken');
export const AtreyuClientToken = createToken<AtreyuType>('AtreyuClientToken');
