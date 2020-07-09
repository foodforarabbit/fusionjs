/* @flow */
import {createToken} from 'fusion-core';
import type {EnvOverrideType, LoggerConfigType} from './types';

export const ErrorTrackingToken = createToken<Object>('LoggerErrorTracking');
export const LoggerConfigToken = createToken<LoggerConfigType>(
  'LoggerConfigToken'
);
export const EnvOverrideToken = createToken<EnvOverrideType>('EnvOverride');
