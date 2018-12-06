// @flow
import {createToken} from 'fusion-core';
import Atreyu from '@uber/atreyu';

export const AtreyuToken = createToken<typeof Atreyu>('AtreyuToken');
export const AtreyuConfigToken = createToken<Object>('AtreyuConfigToken');
export const AtreyuOptionsToken = createToken<Object>('AtreyuOptionsToken');
export const AtreyuClientToken = createToken<typeof Atreyu>(
  'AtreyuClientToken'
);
