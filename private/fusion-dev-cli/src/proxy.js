// @flow
const cp = require('child_process');

/*::
import type {Arguments} from './parse-args.js';
*/

module.exports.proxy = ({command, args} /*: Arguments*/) => {
  return cp.spawn(command, args, {stdio: 'inherit'});
};
