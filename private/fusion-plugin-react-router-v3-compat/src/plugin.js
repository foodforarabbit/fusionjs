import React from 'react';
import {createPlugin} from 'fusion-core';

import {Router4Compat} from './Router4Compat';

/* PLUGIN NOT RECOMMENDED, USE THE COMPONENTS INSTEAD */
// To use the plugin you have to ensure its registration order being
// the first registered plugin modifying ctx.element. Using compatible
// components is much more flexible for your rendering needs.

export default createPlugin({
  middleware: () => async (ctx, next) => {
    if (!ctx.element) {
      return next();
    }

    const routes = ctx.element;

    ctx.element = <Router4Compat v3Routes={routes} />;
    return next();
  },
});
