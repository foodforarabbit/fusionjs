// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import axe from 'react-axe';
import type {Context} from 'fusion-core';

/* Accessibility Middleware
 *
 * Installs https://github.com/dequelabs/react-axe on the page. Intended for
 * use in the browser when developing websites and web apps. In production, this
 * is a no-op and does not compile react-axe into the bundle.
 */

const AXE_DEBOUNCE_MILLISECONDS = 1000;

export default (ctx: Context, next: () => Promise<*>): Promise<*> => {
  if (__DEV__) {
    axe(React, ReactDOM, AXE_DEBOUNCE_MILLISECONDS);
  }
  return next();
};
