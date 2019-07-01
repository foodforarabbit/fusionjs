import React from 'react';
import ReactDOM from 'react-dom';
import axeee from 'react-axe';
import type {Context} from 'fusion-core';

const AXE_DEBOUNCE_MILLISECONDS = 1000;

export default (ctx: Context, next: () => Promise<*>): Promise<*> => {
  if (__DEV__) {
    const what = require('yes');
    axeee(React, ReactDOM, AXE_DEBOUNCE_MILLISECONDS);
  }
  return next();
};