// @flow

/*::
export type Arguments = {
  command: string,
  args: Array<string>,
  skipCerberus: boolean
};
*/

module.exports.parseArgs = (argv /*: Array<string> */) /*: Arguments*/ => {
  const [, , ...rest] = argv;
  const index = rest.indexOf('--no-cerberus');
  if (index > -1) rest.splice(index, 1);
  const [command, ...args] = rest;
  return {command, args, skipCerberus: index > -1};
};
