/* @flow */

import proc from 'child_process';
import {readFile, writeFile} from '@dubstep/core';
import {remove} from 'fs-extra';
import {upgrade} from './upgrade.js';

jest.mock('@dubstep/core', () => {
  // $FlowFixMe
  const actual = require.requireActual('@dubstep/core');
  return {
    ...actual,
    step: jest.fn(id => {
      return {
        id,
        step: () => true,
      };
    }),
  };
});

test('upgrade', async () => {
  await upgrade({dir: 'some/dir', match: '', force: true});
  const {step} = require('@dubstep/core');
  expect(step).toBeCalled();
});
