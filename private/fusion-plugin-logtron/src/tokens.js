/* @flow */
import {createToken} from 'fusion-core';

export const BackendsToken = createToken<Object>('LogtronBackends');
export const TeamToken = createToken<string>('LogtronTeam');
export const TransformsToken = createToken<any>('LogtronTransform');
