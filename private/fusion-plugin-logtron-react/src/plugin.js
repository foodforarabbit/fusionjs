// @flow

import LogtronPlugin from '@uber/fusion-plugin-logtron';
import {ProviderPlugin} from 'fusion-react';
import type {Logger as LoggerType} from 'fusion-tokens';
import type {LogtronDepsType} from '@uber/fusion-plugin-logtron';

export default ProviderPlugin.create<LogtronDepsType, LoggerType>(
  'logger',
  LogtronPlugin
);
