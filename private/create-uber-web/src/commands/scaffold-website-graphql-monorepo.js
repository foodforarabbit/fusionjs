// @flow
import {scaffoldWebsiteMonorepo} from './scaffold-website-monorepo.js';

export type Options = {
  root: string,
  project: ProjectData,
  localPath: ?string,
  skipInstall: boolean,
  hoistDeps: boolean,
};

export type ProjectData = {
  type: string,
  name: string,
  description: string,
  team: string,
  external: ?boolean,
};

export const scaffoldWebsiteGraphqlMonorepo = async ({
  root,
  project,
  hoistDeps,
  localPath,
  skipInstall,
}: Options) => {
  await scaffoldWebsiteMonorepo({
    root,
    project,
    hoistDeps,
    localPath,
    skipInstall,
  });
};
