/* @flow */

import request from 'request-promise-native';

export const getNpmVersion = async (nodeVersion: string) => {
  const html = await request('https://nodejs.org/en/download/releases/');
  const nodeVersionIndex = html.indexOf(nodeVersion);
  const npmIndex = html.indexOf('npm', nodeVersionIndex);
  const gtIndex = html.indexOf('>', npmIndex);
  const ltIndex = html.indexOf('<', gtIndex);
  return html.slice(gtIndex + 1, ltIndex);
};
