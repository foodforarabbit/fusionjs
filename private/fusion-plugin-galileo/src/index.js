// Main export file
import {createToken} from 'fusion-core';
import server, {ConfigToken} from './server';
import browser from './browser';

export default (__NODE__ ? server : browser);
export const GalileoConfigToken = __NODE__ && ConfigToken;
export const GalileoToken = createToken('GalileoToken');
