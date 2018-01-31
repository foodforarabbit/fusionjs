import {createToken, createOptionalToken} from 'fusion-tokens';

export const FliprToken = createToken('FliprToken');

export const FliprClientToken = createOptionalToken('FliprClientToken', null);
export const FliprConfigToken = createOptionalToken('FliprConfigToken', {});
