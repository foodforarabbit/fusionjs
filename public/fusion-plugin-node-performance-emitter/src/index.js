/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Main export file
import browser from './browser';
import server from './server';

export default (__BROWSER__ ? browser : server);
