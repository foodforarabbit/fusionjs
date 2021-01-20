// @flow
"use strict";

const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const Octokit = require("@octokit/rest");
const TOML = require("@iarna/toml");

const {
  RELEASES_DIRECTORY_PATH,
  RELEASE_MANIFEST_FILENAME
} = require("@publisher/core/releases.js");
const {
  CanaryDeployment,
  StableDeployment
} = require("@publisher/core/deployments.js");

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

type Manifest = {
  projects: Array<string>,
  excludeFromPublishing: Array<string>,
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

handleDeployment().catch(err => {
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
  const { id, unchangedPackages } = CanaryDeployment.deserializePayload(
    payload
  );
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
        const {
          location,
          localDependencies,
        } = workspace[name];

        if (unchangedPackages[name]) {
          packages[name] = {
            dir: location,
            version: unchangedPackages[name],
            distTag,
            publish: false,
            localDependencies
          };
        } else {
          packages[name] = {
            dir: location,
            version,
            distTag,
            publish: true,
            localDependencies
          };
        }
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

    console.log("Writing versioned_packages.json artifact...");
    await writeJson("versioned_packages.json", packages);
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
