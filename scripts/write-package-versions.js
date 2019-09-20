// @flow
"use strict";

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

(async () => {
  const [, , packagesPath, dir] = process.argv;
  const packages = await readJson(packagesPath);
  await writeVersions(packages, dir);
})().catch(err => {
  console.error(err);
  process.exit(1);
});

/*::
type Versions = {
  +[string]: {
    dir: string,
    version: string,
  }
};
*/

async function writeVersions(packages /*: Versions */, dir /*: string */) {
  const jsonPath = path.join(dir, "package.json");
  const json = await readJson(jsonPath);

  // Set package version
  json.version = packages[json.name].version;

  // Set dependency versions
  for (const dep of Object.keys(packages)) {
    const depVersion = packages[dep].version;
    if (json.dependencies && json.dependencies[dep]) {
      json.dependencies[dep] = depVersion;
    }
    if (json.devDependencies && json.devDependencies[dep]) {
      json.devDependencies[dep] = depVersion;
    }
    if (json.peerDependencies && json.peerDependencies[dep]) {
      json.peerDependencies[dep] = depVersion;
    }
  }

  await writeJson(jsonPath, json);
}

async function readJson(path) {
  const contents = await readFile(path);
  return JSON.parse(contents);
}

async function writeJson(path, json) {
  return writeFile(path, JSON.stringify(json, null, 2) + "\n");
}
