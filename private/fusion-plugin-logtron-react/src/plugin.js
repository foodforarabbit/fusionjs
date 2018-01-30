import LogtronPlugin from '@uber/fusion-plugin-logtron';
import {ProviderPlugin} from 'fusion-react';

export default ProviderPlugin.create('logger', LogtronPlugin);
