// @flow

import {createToken} from 'fusion-core';
import type {Token} from 'fusion-core';

export const GalileoConfigToken: Token<any> = (__NODE__ &&
  createToken('GalileoConfig'): any);
export const GalileoClientToken: Token<any> = createToken('GalileoClient');
export const GalileoToken: Token<any> = createToken('GalileoToken');
