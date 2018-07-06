// @flow
import UberServerErrorHandler from './server';
import UberBrowserErrorHandler from './browser';

import type {FusionPlugin} from 'fusion-core';
import type {ErrorHandlingDepsType, ErrorHandlingServiceType} from './types';

declare var __NODE__: Boolean;
const plugin = __NODE__ ? UberServerErrorHandler : UberBrowserErrorHandler;
export default ((plugin: any): FusionPlugin<
  ErrorHandlingDepsType,
  ErrorHandlingServiceType
>);
