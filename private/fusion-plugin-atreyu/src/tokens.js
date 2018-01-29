import {createToken, createOptionalToken} from 'fusion-tokens';

export const AtreyuToken = createToken('AtreyuToken');
export const AtreyuConfigToken = createOptionalToken('AtreyuConfigToken', {});
export const AtreyuOptionsToken = createOptionalToken('AtreyuOptionsToken', {});
export const AtreyuClientToken = createOptionalToken('AtreyuClientToken', null);
