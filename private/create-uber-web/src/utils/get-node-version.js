/* @flow */

import request from 'request-promise-native';

export const getNodeVersion = async () => {
  const changelog =
    'https://raw.githubusercontent.com/nodejs/node/master/doc/changelogs/CHANGELOG_V8.md';
  const html = await request(changelog);
  return html.match(/<a href="#(.+?)">\1<\/a>/)[1];
};
