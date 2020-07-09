// @flow
import type {LevelMapType} from './types.js';

export const levelMap: LevelMapType = {
  fatal: {levelName: 'fatal', level: 0},
  error: {levelName: 'error', level: 1},
  warn: {levelName: 'warn', level: 2},
  info: {levelName: 'info', level: 3},
  debug: {levelName: 'debug', level: 4},
  silly: {levelName: 'silly', level: 5},
  verbose: {levelName: 'verbose', level: 6},
  trace: {levelName: 'trace', level: 7},
  access: {levelName: 'access', level: 8},
};
