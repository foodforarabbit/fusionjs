// @flow
import {withServices} from 'fusion-react';
import {TealiumToken} from '@uber/fusion-plugin-tealium';

export const withTealium = withServices({
  tealium: TealiumToken,
});
