// @flow
"use strict";

const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const execFile = promisify(cp.execFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

module.exports = getMonorepoPackages;

/*::
type Manifest = {
  projects: Array<string>,
  excludeFromPublishing: Array<string>,
};
type ProjectData = {
  name: string,
  path: string,
  contents: Object,
};
type Packages = {
  [string]: {
    location: string,
    localDependencies: Array<string>,
  }
};
*/

async function getMonorepoPackages() /*: Promise<Packages> */ {
  const { projects, excludeFromPublishing } = await getProjects();

  const projectData /*: Array<ProjectData> */ = await Promise.all(
    projects.map(async project => {
      const contents = await readFile(
        path.join(project, "package.json"),
        "utf8"
      );
      const parsedContents = JSON.parse(contents);
      return {
        name: parsedContents.name,
        path: project,
        contents: parsedContents
      };
    })
  );

  const localPackages = new Map();
  for (const project of projectData) {
    localPackages.set(project.name, project.contents);
  }

  const pkgs /*: Packages */ = {};

  for (const project of projectData) {
    if (excludeFromPublishing.includes(project.path)) {
      continue;
    }

    const pkg = localPackages.get(project.name);
    if (!pkg) throw new Error(`No package.json for ${project.name}`);

    const localDependencies /*: Set<string> */ = new Set();
    if (pkg.dependencies) {
      for (const dep of Object.keys(pkg.dependencies)) {
        if (localPackages.has(dep)) {
          localDependencies.add(dep);
        }
      }
    }
    if (pkg.peerDependencies) {
      for (const dep of Object.keys(pkg.peerDependencies)) {
        if (localPackages.has(dep)) {
          localDependencies.add(dep);
        }
      }
    }
    if (pkg.optionalDependencies) {
      for (const dep of Object.keys(pkg.optionalDependencies)) {
        if (localPackages.has(dep)) {
          localDependencies.add(dep);
        }
      }
    }

    pkgs[project.name] = {
      location: project.path,
      localDependencies: Array.from(localDependencies)
    };
  }

  return pkgs;
}

async function getProjects() /*: Promise<Manifest> */ {
  const contents = await readFile("manifest.json", "utf8");
  const json = JSON.parse(contents);

  return (json /*: Manifest */);
}
