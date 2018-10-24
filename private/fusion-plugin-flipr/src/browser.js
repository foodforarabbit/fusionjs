// @flow
/* eslint-env browser */
// TODO: [Nice to have] Make specified Flipr properties in config.clientProperties available on client
import {createPlugin} from 'fusion-core';
import type {FusionPlugin} from 'fusion-core';

const plugin = __BROWSER__ && createPlugin({});

export default ((plugin: any): FusionPlugin<any, any>);
