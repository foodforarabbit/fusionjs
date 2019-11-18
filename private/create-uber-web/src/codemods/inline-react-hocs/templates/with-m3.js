// @flow
import {withServices} from 'fusion-react';
import {M3Token} from '@uber/fusion-plugin-m3';

export const withM3 = withServices({
  m3: M3Token,
});
