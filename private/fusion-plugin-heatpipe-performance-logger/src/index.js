// @flow
import type {
  HeatpipePerformanceLoggerDepsType,
  HeatpipePerformanceLoggerType,
} from './types';

import server from './server';
import browser from './browser';

export default __NODE__ ? server : browser;

export type {HeatpipePerformanceLoggerDepsType, HeatpipePerformanceLoggerType};
