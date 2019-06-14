import React from 'react';
import ReactDOM from 'react-dom';
import type {Context} from 'fusion-core';

const AXE_DEBOUNCE_MILLISECONDS = 1000;

export default (ctx: Context, next: () => Promise<*>): Promise<*> => {
  if (__DEV__) {
    const axeee = require('react-axe');
    axeee(React, ReactDOM, AXE_DEBOUNCE_MILLISECONDS);
  }
  return next();
};