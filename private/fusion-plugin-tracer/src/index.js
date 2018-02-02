// Main export file
import {createToken} from 'fusion-core';
import browser from './browser';
import server, {
  TracerOptionsToken as OptionsToken,
  TracerConfigToken as ConfigToken,
} from './server';

export const TracerToken = createToken('Tracer');

export default (__NODE__ ? server : browser);

export const TracerOptionsToken = __NODE__ && OptionsToken;
export const TracerConfigToken = __NODE__ && ConfigToken;
