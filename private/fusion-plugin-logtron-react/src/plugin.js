// @flow

import LogtronPlugin from '@uber/fusion-plugin-logtron';
import {ProviderPlugin} from 'fusion-react';
import type {Logger as LoggerType} from 'fusion-tokens';

export default ProviderPlugin.create<any, LoggerType>('logger', LogtronPlugin);
