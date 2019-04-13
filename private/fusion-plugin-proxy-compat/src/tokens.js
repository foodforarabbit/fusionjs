// @flow
/* eslint-env node */
const {createToken} = require('fusion-core');

/*::
import type {Token} from 'fusion-core';
import type {ProxyConfigType} from './types';
*/

module.exports.ProxyConfigToken = (createToken(
  'ProxyConfig'
) /*: Token<ProxyConfigType> */);
