// @flow
import M3Plugin from '@uber/fusion-plugin-m3';
import {ProviderPlugin} from 'fusion-react';
import type {M3DepsType, M3Type} from '@uber/fusion-plugin-m3';

export default ProviderPlugin.create<M3DepsType, M3Type>('m3', M3Plugin);
