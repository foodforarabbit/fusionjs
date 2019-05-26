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

const getMonorepoPackages = require("./get-packages.js");

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
  .then(() => handleDeployment())
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function handleDeployment() {
  const github = new Octokit({
    auth: `token ${token}`,
    previews: ["ant-man-preview", "flash-preview", "shadow-cat-preview"]
  });

  const payload = JSON.parse(deploymentPayload);
  const task = deploymentTask;

  if (task === CanaryDeployment.taskId) {
    await publishCanary(github, payload);
  } else if (task === StableDeployment.taskId) {
    await publishStable(github, payload);
  }
}

async function publishCanary(github, payload) {
  const { id } = CanaryDeployment.deserializePayload(payload);
  if (!commit) {
    throw new Error("BUILDKITE_COMMIT must be set");
  }

  const shorthash = commit.substr(0, 7);
  const version = `0.0.0-canary.${shorthash}.${id}`;
  const distTag = "canary";

  await publishDeployment(
    github,
    { owner, repo, deployment_id: deploymentId },
    async () => {
      const workspace = await getMonorepoPackages();
      const packages /*: Packages */ = {};

      for (const name of Object.keys(workspace)) {
        const { location, localDependencies } = workspace[name];

        packages[name] = {
          dir: location,
          version,
          distTag,
          publish: true,
          localDependencies
        };
      }
      return packages;
    }
  );
}

async function publishStable(github, payload) {
  const { id } = StableDeployment.deserializePayload(payload);

  const tomlFile = await readFile(
    `${RELEASES_DIRECTORY_PATH}/${id}/${RELEASE_MANIFEST_FILENAME}`
  );
  const packages = TOML.parse(tomlFile);

  await publishDeployment(
    github,
    { owner, repo, deployment_id: deploymentId },
    async () => {
      const workspace = await getMonorepoPackages();
      const packagesToPublish /*: Packages */ = {};

      for (const [pkg, { version, publish }] of Object.entries(packages)) {
        const { location, localDependencies } = workspace[pkg];

        packagesToPublish[pkg] = {
          dir: location,
          localDependencies,
          version,
          distTag: "latest",
          publish: publish === false ? false : true
        };
      }

      return packagesToPublish;
    }
  );
}

async function publishDeployment(
  github,
  { owner, repo, deployment_id },
  getPackages
) {
  const started_at = new Date().toISOString();

  await github.repos.createDeploymentStatus({
    owner,
    repo,
    deployment_id,
    state: "in_progress"
  });

  try {
    const packages = await getPackages();

    await writeVersions(packages);
    const { stdout } = await execFile("git", ["diff"]);
    console.log("=== Diff ===");
    console.log(stdout);
    console.log("=== Publish ===");
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
  const sorted = getTopologicalOrder(packages);

  console.log("=== Topological order ===");
  console.log(
    sorted.map(pkg =>
      packages[pkg].publish === false ? `${pkg} (publish: false)` : pkg
    )
  );

  const artifacts /* Array<{tarPath: string, distTag: string}> */ = [];
  console.log("Packing tarballs...");
  for (const pkg of sorted) {
    const { dir, distTag, publish } = packages[pkg];
    if (publish) {
      const packed = await pack(dir);
      artifacts.push({
        tarPath: path.join(dir, packed.filename),
        distTag
      });
    }
  }

  console.log("Publishing...");
  const published = [];
  try {
    for (const { tarPath, distTag } of artifacts) {
      const result = await publish(tarPath, distTag);
      const { id, shasum } = result;
      console.log(
        `${id} successfully published (dist-tag: ${distTag}, shasum: ${shasum})`
      );
      published.push(result);
    }
  } catch (err) {
    console.error(err);
    console.log("Error ocurred. Unpublishing...");
    for (const pkg of published) {
      // unpublish...
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

async function publish(dir /*: string */, distTag /*: string*/) {
  const { stdout } = await execFile("npm", [
    "publish",
    dir,
    "--tag",
    distTag,
    "--json"
  ]);
  const publishData = JSON.parse(stdout);
  return (publishData /*: PublishData */);
}

/*::
type Versions = {
  +[string]: {
    dir: string,
    version: string,
  }
};
*/

async function writeVersions(packages /*: Versions */) {
  return await Promise.all(
    Object.keys(packages).map(async pkgId => {
      const { dir, version } = packages[pkgId];
      const jsonPath = path.join(dir, "package.json");

      const json = await readJson(jsonPath);
      json.version = version;

      // Write dependency versions
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
    })
  );
}

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
