// @flow
import {LoggerToken} from 'fusion-tokens';

export type TealiumConfigType = any => any;
export type TealiumType = {
  +identify: string => void,
  +track: any => void,
  +pageview: ({title: string, page: string, data: any}) => void,
};
export type TealiumDepsType = {
  config: TealiumConfigType,
  logger: typeof LoggerToken,
};
