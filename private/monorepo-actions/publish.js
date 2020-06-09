// @flow
"use strict";

const cp = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { promisify } = require("util");
const execFile = promisify(cp.execFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

const Octokit = require("@octokit/rest");
const TOML = require("@iarna/toml");
const tarjan = require("@rtsao/scc");

const {
  RELEASES_DIRECTORY_PATH,
  RELEASE_MANIFEST_FILENAME
} = require("@publisher/core/releases.js");
const {
  CanaryDeployment,
  StableDeployment
} = require("@publisher/core/deployments.js");

const { pack } = require("@publisher/npm-helpers");

/*::
type Packages = {
  [string]: {
    dir: string,
    version: string,
    publish: boolean,
    localDependencies: Array<string>,
    distTag: string,
  }
};
*/

const deploymentEnvironment =
  process.env.BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT;
const deploymentId = process.env.BUILDKITE_GITHUB_DEPLOYMENT_ID;
const deploymentPayload = process.env.BUILDKITE_GITHUB_DEPLOYMENT_PAYLOAD;
const deploymentTask = process.env.BUILDKITE_GITHUB_DEPLOYMENT_TASK;
const token = process.env.GH_TOKEN;
const commit = process.env.BUILDKITE_COMMIT;
const owner = "uber";
const repo = "fusionjs";

if (!deploymentEnvironment)
  throw new Error("BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT is required");
if (!deploymentId)
  throw new Error("BUILDKITE_GITHUB_DEPLOYMENT_ID is required");
if (!deploymentPayload)
  throw new Error("BUILDKITE_GITHUB_DEPLOYMENT_PAYLOAD is required");
if (!deploymentTask)
  throw new Error("BUILDKITE_GITHUB_DEPLOYMENT_TASK is required");
if (!token) throw new Error("GH_TOKEN is required");
if (!commit) throw new Error("BUILDKITE_COMMIT is required");

setupRegistryCredentials()
  .then(() => publishDeployment())
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function publishDeployment() {
  const github = new Octokit({
    auth: `token ${token}`,
    previews: ["ant-man-preview", "flash-preview", "shadow-cat-preview"]
  });

  const deployment_id = deploymentId;

  try {
    const packages = await readJson("versioned_packages.json");
    await publishRelease(packages);
  } catch (err) {
    await github.repos.createDeploymentStatus({
      owner,
      repo,
      deployment_id,
      state: "error"
    });
    throw err;
  }
  /* Buildkite already posts a success status automatically.
   * No need to do it ourselves.
   */
  //   await github.repos.createDeploymentStatus({
  //     owner,
  //     repo,
  //     deployment_id,
  //     state: "success"
  //   });
}

async function publishRelease(packages) {
  /**
   * create-uber-web should be published last because it has
   * implicit dependencies on the template packages, which in
   * turn depend on virtually every package in the monorepo. Since
   * nothing should depend on create-uber-web, publishing
   * create-uber-web last should be a valid topological order.
   */

  const sorted = getTopologicalOrder(packages)
    .filter(pkg => pkg !== "@uber/create-uber-web")
    .concat("@uber/create-uber-web");

  console.log("+++ Topological order");
  console.log(
    sorted.map(pkg =>
      packages[pkg].publish === false ? `${pkg} (publish: false)` : pkg
    )
  );

  const artifacts /* Array<{tarPath: string, distTag: string}> */ = [];
  for (const pkg of sorted) {
    const { dir, distTag, version, publish } = packages[pkg];
    const name = pkg.replace("@uber/", "uber-");

    if (publish) {
      artifacts.push({
        tarPath: `${name}-${version}.tgz`,
        distTag
      });
    }
  }

  console.log("+++ Publishing...");
  const published = [];
  try {
    for (const { tarPath, distTag } of artifacts) {
      if (!fs.existsSync(tarPath)) {
        throw new Error(`${tarPath} does not exist`);
      }
      const result = await publish(tarPath, distTag);
      const { id, shasum } = result;
      console.log(
        `${id} successfully published (dist-tag: ${distTag}, shasum: ${shasum})`
      );
      published.unshift(result); // Unpublish in topological order (reverse order of publish)
    }
  } catch (err) {
    process.exitCode = 1;
    console.log("^^^ +++ Error ocurred. Unpublishing...");
    console.error(err);
    for (const pkg of published) {
      console.log(`Unpublishing ${pkg.id}`);
      const stdout = await unpublish(pkg.id);
      console.log(stdout);
    }
  }
}

async function setupRegistryCredentials() {
  const npmrcPath = path.join(os.homedir(), ".npmrc");
  let contents = await readFile(npmrcPath, "utf8");
  contents = contents.replace(
    "registry = https://unpm.uberinternal.com",
    "registry = https://registry.npmjs.org"
  );
  contents += "@uber:registry = https://unpm.uberinternal.com\n";
  contents += "//registry.npmjs.org/:_authToken = ${NPM_TOKEN}\n";
  contents += "access = public\n";
  await writeFile(npmrcPath, contents);
}

function getTopologicalOrder(packages) {
  const graph = new Map();
  for (const [pkg, { localDependencies }] of Object.entries(packages)) {
    graph.set(pkg, new Set(localDependencies));
  }
  const scc = tarjan(graph);

  if (scc.length !== Object.keys(packages).length) {
    throw new Error("Package dependency graph contains cycles");
  }

  const sorted = [];
  for (const set of scc) {
    for (const pkg of set) {
      sorted.push(pkg);
    }
  }
  return sorted;
}

/*::
type PublishData = {
  id: string,
  name: string,
  version: string,
  from: string,
  size: number,
  unpackedSize: number,
  shasum: string,
  integrity: string,
  files: Array<{| path: string, size: number, mode: number |}>,
  entryCount: number,
  bundled: Array<any>
};
*/

async function publish(path /*: string */, distTag /*: string*/) {
  const { stdout } = await execFile("npm", [
    "publish",
    path,
    "--tag",
    distTag,
    "--json"
  ]);
  const publishData = JSON.parse(stdout);
  return (publishData /*: PublishData */);
}

async function unpublish(id /*: string */) {
  const { stdout } = await execFile("npm", ["unpublish", id]);
  return stdout;
}

/*::
type Versions = {
  +[string]: {
    dir: string,
    version: string,
  }
};
*/

async function readJson(path) {
  const contents = await readFile(path);
  return JSON.parse(contents);
}

async function writeJson(path, json) {
  return writeFile(path, JSON.stringify(json, null, 2) + "\n");
}

// https://github.com/facebook/flow/issues/2174
/*::
declare class Object {
  static entries<T>({ [string]: T }): Array<[string, T]>;
  static entries<T>({ [number]: T }): Array<[string, T]>;
}

*/
