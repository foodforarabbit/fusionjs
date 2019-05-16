// @flow
"use strict";

const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const execFile = promisify(cp.execFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

const App = require("@octokit/app");
const Octokit = require("@octokit/rest");
const { DRAFT_BRANCH_PREFIX } = require("@publisher/core/releases.js");
const { PackageHashes } = require("@publisher/core/package-hashes.js");
const { pack } = require("@publisher/npm-helpers");

const getMonorepoPackages = require("./get-packages.js");

pushHandler({
  branch: (process.env.BUILDKITE_BRANCH /*: any */),
  commit: (process.env.BUILDKITE_COMMIT /*: any */),
  owner: "uber",
  repo: "fusionjs"
}).catch(err => {
  console.error(err);
  process.exit(1);
});

/*::

type HandlerContext = {
  owner: string,
  repo: string,
  branch: string,
  commit: string,
};

*/

async function pushHandler(context /*: HandlerContext */) {
  if (context.branch.startsWith(DRAFT_BRANCH_PREFIX)) {
    return;
  }

  const app = new App({
    id: process.env.GH_CHECKS_APP_ID,
    privateKey: Buffer.from(
      (process.env.GH_CHECKS_APP_KEY_BASE64 /*: any */),
      "base64"
    ).toString()
  });

  const github = new Octokit({
    async auth() {
      const installationAccessToken = await app.getInstallationAccessToken({
        installationId: process.env.GH_CHECKS_APP_INSTALLATION_ID
      });
      return `token ${installationAccessToken}`;
    }
  });

  await reportChangedPackages(github, context);
}

async function reportChangedPackages(github, { owner, repo, commit }) {
  const started_at = new Date().toISOString();

  const pkgs = await getMonorepoPackages();
  const packages = await getPackedHashes(pkgs);

  await github.checks.create({
    owner,
    repo,
    name: PackageHashes.checkRunName,
    head_sha: commit,
    status: "completed",
    started_at,
    completed_at: new Date().toISOString(),
    conclusion: "success",
    output: {
      title: "Package tarball hashes",
      summary: "Package tarball hashes",
      text: PackageHashes.serializeCheckRunOutputText(packages)
    }
  });
}

async function getPackedHashes(pkgs) {
  const packed = await Promise.all(
    Object.keys(pkgs).map(async pkg => {
      const { location, localDependencies } = pkgs[pkg];
      return await pack(location);
    })
  );

  const data = {};
  for (const item of packed) {
    data[item.name] = {
      shasum: item.shasum,
      localDependencies: pkgs[item.name].localDependencies
    };
  }
  return data;
}
