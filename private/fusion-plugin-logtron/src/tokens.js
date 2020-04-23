/* @flow */
import {createToken} from 'fusion-core';
import type {EnvOverrideType} from './types';

export const ErrorTrackingToken = createToken<Object>('LoggerErrorTracking');
export const TeamToken = createToken<string>('LoggerTeam');
export const EnvOverrideToken = createToken<EnvOverrideType>('EnvOverride');
