// @flow
"use strict";

const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const execFile = promisify(cp.execFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

const { DRAFT_BRANCH_PREFIX } = require("@publisher/core/releases.js");
const { PackageHashes } = require("@publisher/core/package-hashes.js");

const getMonorepoPackages = require("./get-packages.js");
const { create_github_app } = require("./gh-api-helper.js");

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

  await reportChangedPackages(create_github_app(), context);
}

async function reportChangedPackages(github, { owner, repo, commit }) {
  const started_at = new Date().toISOString();

  const pkgs = await getMonorepoPackages();
  const packages = getPackedHashes(pkgs);

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

function getPackedHashes(pkgs) {
  const data = {};
  for (const id of Object.keys(pkgs)) {
    const pkg = pkgs[id];
    const shasumPath = `${process.cwd()}/${encodeURIComponent(id)}-shasum.json`;
    // $FlowFixMe (dynamic require)
    const shasum = require(shasumPath);
    data[id] = {
      shasum,
      localDependencies: pkg.localDependencies
    };
  }
  return data;
}
