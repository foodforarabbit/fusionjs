// @flow
import {createPlugin} from 'fusion-core';

declare var __BROWSER__: boolean;

export default __BROWSER__ && createPlugin({provides: () => {}});
