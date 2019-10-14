/* @flow */

import {promptChoice} from '../utils/prompt-choice.js';
import {scaffoldLibrary} from './scaffold-library.js';
import {scaffoldFusionPlugin} from './scaffold-fusion-plugin.js';
import {scaffoldWebsite} from './scaffold-website.js';
import {scaffoldWebsiteGraphql} from './scaffold-website-graphql.js';

export type ScaffoldOptions = {
  type: string,
  name: string,
  description: string,
  team: string,
  external: ?boolean,
  localPath: ?string,
  skipInstall: boolean,
  hoistDeps: boolean,
  root: string,
};

export type ProjectData = {
  type: string,
  name: string,
  description: string,
  team: string,
  external: ?boolean,
};

export const scaffold = async ({
  type,
  name,
  description,
  team,
  external,
  localPath,
  skipInstall,
  hoistDeps,
  root,
}: ScaffoldOptions) => {
  const project = {type, name, description, team, external};
  if (project.type === '') {
    project.type = await promptChoice('Choose a template:', {
      'Web Application [Recommended]': 'website-graphql',
      'Legacy Redux/RPC Web Application': 'website',
      'Fusion.js Plugin': 'fusion-plugin',
      'Generic Library': 'library',
    });
  }
  switch (project.type) {
    case 'website':
      await scaffoldWebsite({
        root,
        project,
        hoistDeps,
        localPath,
        skipInstall,
      });
      break;
    case 'website-graphql':
      await scaffoldWebsiteGraphql({
        root,
        project,
        hoistDeps,
        localPath,
        skipInstall,
      });
      break;
    case 'fusion-plugin':
      await scaffoldFusionPlugin({
        root,
        project,
        hoistDeps,
        localPath,
        skipInstall,
      });
      break;
    case 'library':
      await scaffoldLibrary({
        root,
        project,
        hoistDeps,
        localPath,
        skipInstall,
      });
      break;
    default: {
      throw new Error(`unsupported project type ${project.type}`);
    }
  }
};
