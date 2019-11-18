// @flow
import {withServices} from 'fusion-react';
import {LoggerToken} from 'fusion-tokens';

export const withLogger = withServices({
  logger: LoggerToken,
});
