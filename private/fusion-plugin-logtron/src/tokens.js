/* @flow */
import {createToken} from 'fusion-core';
import type {EnvOverrideType} from './types';

export const ErrorTrackingToken = createToken<Object>('LoggerErrorTracking');
export const EnvOverrideToken = createToken<EnvOverrideType>('EnvOverride');
