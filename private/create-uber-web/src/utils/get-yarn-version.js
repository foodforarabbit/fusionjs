/* @flow */

import request from 'request-promise-native';

export const getYarnVersion = async () => {
  const config = await request(
    'https://raw.githubusercontent.com/yarnpkg/website/master/_config.yml',
  );
  return config.match(/latest_version: (.+?)\n/)[1];
};
