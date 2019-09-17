// @flow
const { exec, execFile, execFileSync } = require("child_process");
const path = require("path");
const { create_github_app, create_github_user } = require("./gh_api_helper.js");
const assert = require("assert");

const {
  generate_test_fixture,
  modify_test_fixture,
} = require("./generate_test_fixture.js");
const { hashElement } = require("folder-hash");

const simpleGit = require("simple-git");

const FILES = 30, // number of Home files to be generated in the test fixture
  DEPTH = 25, // depth of elements in the test fixture
  WIDTH = 25; // width of elements in the test fixture
const COUNT = 9; // the number of times each build will run

assert(
  COUNT > 0,
  "If COUNT is less than 1, then no builds will be run nor timed."
);
assert(
  FILES > 0,
  "IF FILES is less than 1, modifying files for incremental dev will fail."
);

postStatus(); // posting a 'Sucessful' check so the buildkite job doesn't appear as pending for too long

const path_to_test_fixture = path.join(__dirname, "test-fixture");
const started_at = new Date().toISOString();

generate_test_fixture(FILES, path_to_test_fixture, DEPTH, WIDTH);

const buildCommand = path.join(
  __dirname,
  "node_modules",
  ".bin",
  "fusion"
);
(async function() {
  // runs benchmarks on head
  const data = await doBuilds().catch(err => {
    console.error(err);
    process.exit(1);
  });
  // runs benchmarks on base
  try {
    const baseSha = await getBaseSha();
    if (baseSha != null) {
      await generate_test_fixture(FILES, path_to_test_fixture, DEPTH, WIDTH);
      await simpleGit().checkout(baseSha);
      const data = await doBuilds().catch(err => {
        console.error(err);
        process.exit(1);
      });
      postBuildTime(baseSha, data);
    }
  } catch (error) {
    console.log(error);
  }

  if (typeof process.env.BUILDKITE_COMMIT !== "string") {
    throw new Error(`Missing BUILDKITE_COMMIT env`);
  }
  //post the newer data second to trigger the bot after the base has already been updated
  postBuildTime(process.env.BUILDKITE_COMMIT, data);
})();

async function doBuilds() {
  const cached_build_times = [],
    uncached_build_times = [],
    incremental_build_times = [],
    production_build_times = [];
  let fixture_hash = "";

  try {
    const hash = await hashElement(path_to_test_fixture, {
      folders: { exclude: [".*", "node_modules"] },
    });
    fixture_hash = hash.hash;
    console.log(`Fixture hash is ${fixture_hash}`);
  } catch (error) {
    console.error(error);
  }

  for (let i = 0; i < COUNT; i++) {
    deleteCaches();
    // uncached dev

    let time = await run(buildCommand, ["dev"], {
      cwd: path_to_test_fixture,
      env: {
        ...process.env,
        LOG_END_TIME: "true",
      },
    });

    uncached_build_times.push(time);
    //cached dev
    time = await run(buildCommand, ["dev"], {
      cwd: path_to_test_fixture,
      env: {
        ...process.env,
        LOG_END_TIME: "true",
      },
    });
    cached_build_times.push(time);
  }

  console.log(`Uncached Dev ${uncached_build_times.toString()}`);
  console.log(`Cached Dev ${cached_build_times.toString()}`);

  deleteCaches();

  let child = await new Promise(resolve => {
    const child = execFile(buildCommand, ["dev"], {
      cwd: path_to_test_fixture,
      env: { ...process.env, LOG_END_TIME: "true" },
    });
    child.stdout.on("data", data => {
      let matches = data.match("End time: ([0-9]*)");
      if (matches != null) {
        resolve(child);
      }
    });
  });

  //wait for the build to finish for a child with which we can measure incremental builds
  await new Promise(resolve => setTimeout(resolve, 1000));
  //incremental dev change
  for (let i = 0; i < COUNT; i++) {
    child.stdout.removeAllListeners("data");
    modify_test_fixture(i % FILES, path_to_test_fixture, DEPTH, WIDTH);
    const start = Date.now();
    let duration = await new Promise(resolve => {
      child.stdout.on("data", data => {
        let matches = data.match("End time: ([0-9]*)");
        if (matches != null) {
          const end = matches[1];
          const duration = end - start;
          resolve(duration);
        }
      });
    });
    incremental_build_times.push(duration);
  }
  console.log(`Incremental Dev ${incremental_build_times.toString()}`);
  child.kill();

  // uncached production build
  for (let i = 0; i < COUNT; i++) {
    deleteCaches();
    const time = runResolvingCommand(buildCommand, ["build"], {
      cwd: path_to_test_fixture,
      env: { ...process.env, NODE_ENV: "production", LOG_END_TIME: "true" },
    });
    production_build_times.push(time);
  }
  console.log(`Uncached Production Build ${production_build_times.toString()}`);

  return {
    version: 1,
    fixture: fixture_hash,
    data: [
      {
        build: "cached",
        time: cached_build_times,
      },
      {
        build: "uncached",
        time: uncached_build_times,
      },
      {
        build: "incremental",
        time: incremental_build_times,
      },
      {
        build: "production",
        time: production_build_times,
      },
    ],
  };
}

function run(cmd, args, opts) {
  const start = Date.now();
  const child = execFile(cmd, args, opts);

  return new Promise(resolve => {
    child.stdout.on("data", data => {
      let matches = data.match("End time: ([0-9]*)");
      if (matches != null) {
        const end = matches[1];
        const duration = end - start;
        child.kill();
        resolve(duration);
      }
    });
    child.stderr.on("data", data => {
      console.log(data);
    });
  });
}

function runResolvingCommand(cmd, args, opts) {
  const start = Date.now();
  execFileSync(cmd, args, opts);
  return Date.now() - start;
}

function deleteCaches() {
  exec(
    "rm -rf " +
      path.join(path_to_test_fixture, "node_modules", ".fusion_babel-cache")
  );
  exec("rm -rf " + path.join(path_to_test_fixture, "node_modules", ".cache"));
}

async function postBuildTime(sha /*:string*/, json_data) {
  const github_checks = create_github_app();

  await github_checks.checks.create({
    owner: "uber",
    repo: "fusionjs",
    name: "Benchmarks",
    head_sha: sha,
    status: "completed",
    started_at,
    completed_at: new Date().toISOString(),
    conclusion: "neutral",
    output: {
      title: "Performance",
      summary: "Performance of Compilation",
      text: JSON.stringify(json_data),
    },
  });
  console.log(`\nBuild finished posting data to ${sha}`);
  console.log(JSON.stringify(json_data));
}

async function postStatus() {
  const github = create_github_user();
  try {
    await github.repos.createStatus({
      owner: "uber",
      repo: "fusionjs",
      name: "buildkite/fusionjs-benchmarks",
      sha: process.env.BUILDKITE_COMMIT,
      state: "success",
      description:
        "Job is still running, but should not affect the outcome of the pr",
      target_url: process.env.BUILDKITE_BUILD_URL,
      context: "buildkite/fusionjs-benchmarks",
    });
  } catch (error) {
    console.log(error);
    console.log(
      `Failed to post completed status, the bot has likely reached its rate limit,
       build will continue normally and the status will be updated later`
    );
  }
}

async function getBaseSha() {
  const github = create_github_user();
  try {
    const requests = await github.repos.listPullRequestsAssociatedWithCommit({
      owner: "uber",
      repo: "fusionjs",
      commit_sha: process.env.BUILDKITE_COMMIT,
    });
    if (requests.data.length > 0) {
      const request = requests.data.find(request => {
        return (
          request.head.sha == process.env.BUILDKITE_COMMIT &&
          request.state === "open"
        );
      });
      return request.base.sha;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
}
