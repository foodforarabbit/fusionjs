// @flow
import type {FusionPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';

type DepsType = {
  logger: typeof LoggerToken,
  magellanUri?: string,
  jarvisUri?: string,
};

export type PluginType = FusionPlugin<DepsType, void>;
