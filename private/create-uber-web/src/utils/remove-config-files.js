/* @flow */
import {removeFile} from '@dubstep/core';

export const removeConfigFiles = async (dir: string) => {
  await removeFile(`${dir}/.eslintignore`);
  await removeFile(`${dir}/.flowconfig`);
  await removeFile(`${dir}/.gitignore`);
  await removeFile(`${dir}/.cuprc`);
};
