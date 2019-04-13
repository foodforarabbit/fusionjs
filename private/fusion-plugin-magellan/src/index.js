// @flow
import ServerPlugin from './server';
import BrowserPlugin from './browser';
import {MagellanUriToken} from './tokens';
import type {PluginType} from './types';

export default (((__NODE__ ? ServerPlugin : BrowserPlugin): any): PluginType);
export {MagellanUriToken};
