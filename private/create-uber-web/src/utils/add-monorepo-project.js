/* @flow */
import {pathExists, readJson, writeJson} from 'fs-extra';

type Args = {
  root: string,
  project: string,
};

export const addMonorepoProject = async ({root, project}: Args) => {
  if (
    !(await pathExists(`${root}/manifest.json`)) ||
    !(await pathExists(`${root}/WORKSPACE`))
  ) {
    throw new Error(`${root} is not an app monorepo root directory`);
  }
  const data = await readJson(`${root}/manifest.json`);
  data.projects = [
    ...new Set([...data.projects, `projects/${project}`]),
  ].sort();
  await writeJson(`${root}/manifest.json`, data, {spaces: 2});
};
