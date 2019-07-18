/* @flow */

import {promptChoice} from '../utils/prompt-choice.js';
import {scaffoldLibrary} from './scaffold-library.js';
import {scaffoldFusionPlugin} from './scaffold-fusion-plugin.js';
import {scaffoldWebsite} from './scaffold-website.js';
import {scaffoldWebsiteMonorepo} from './scaffold-website-monorepo.js';
import {scaffoldWebsiteGraphql} from './scaffold-website-graphql.js';
import {scaffoldWebsiteGraphqlMonorepo} from './scaffold-website-graphql-monorepo.js';

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
      'Web Application': 'website',
      'GraphQL Web Application [!! BETA !!]': 'website-graphql',
      'Web Application [web-code monorepo]': 'website-monorepo',
      'GraphQL Web Application [web-code monorepo]': 'website-graphql-monorepo',
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
    case 'website-monorepo':
      await scaffoldWebsiteMonorepo({
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
    case 'website-graphql-monorepo':
      await scaffoldWebsiteGraphqlMonorepo({
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
