import {createToken, createOptionalToken} from 'fusion-tokens';

const HeatpipeToken = createToken('HeatpipeToken');
const HeatpipeConfigToken = createOptionalToken('HeatpipeConfigToken', {});

export {HeatpipeToken, HeatpipeConfigToken};
