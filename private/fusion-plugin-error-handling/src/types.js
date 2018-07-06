// @flow

import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';

export type ErrorHandlingServiceType = (
  e: Error,
  captureType: string
) => Promise<void> | void;

export type ErrorHandlingDepsType = {|
  logger: typeof LoggerToken,
  m3: typeof M3Token,
|};
