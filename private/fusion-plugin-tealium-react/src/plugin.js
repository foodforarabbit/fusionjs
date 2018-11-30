// @flow
import TealiumPlugin from '@uber/fusion-plugin-tealium';
import {ProviderPlugin} from 'fusion-react';

export default ProviderPlugin.create<any, any>('tealium', TealiumPlugin);
