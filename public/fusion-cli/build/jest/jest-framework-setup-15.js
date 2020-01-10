/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// This file is not used by fusion-cli directly anywhere. It might be imported from elsewhere.

/* eslint-env node */
/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
// $FlowFixMe
import {configure} from 'enzyme';
// $FlowFixMe
import Adapter from 'enzyme-adapter-react-15';
/* eslint-enable import/no-unresolved, import/no-extraneous-dependencies */

// Setup Enzyme for all Jest tests
configure({adapter: new Adapter()});
