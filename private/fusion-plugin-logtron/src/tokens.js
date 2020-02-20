/* @flow */
import {createToken} from 'fusion-core';

export const ErrorTrackingToken = createToken<Object>('LoggerErrorTracking');
export const TeamToken = createToken<string>('LoggerTeam');
export const EnvOverrideToken = createToken<string>('EnvOverride');
