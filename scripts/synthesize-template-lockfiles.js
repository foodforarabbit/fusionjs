// @flow
"use strict";

const path = require("path");
const { merge } = require("../public/jazelle/utils/lockfile.js");
const { getManifest } = require("../public/jazelle/utils/get-manifest.js");
const {
  getLocalDependencies
} = require("../public/jazelle/utils/get-local-dependencies.js");
const child_process = require("child_process");
const { promisify } = require("util");

const execFile = promisify(child_process.execFile);

const root = path.join(__dirname, "../");

const templates = [
  "template-fusion-plugin",
  "template-library",
  "template-website-graphql",
  "template-website"
].map(name => path.join(root, "private", name));

(async () => {
  const { projects } = await getManifest({ root });

  for (const app of templates) {
    const deps = await getLocalDependencies({
      dirs: projects.map(dir => path.join(root, dir)),
      target: app
    });

    const roots = deps.map(dep => dep.dir);

    await merge({
      roots: roots,
      ignore: [],
      out: app
    });

    // Merge mutates package.json in addition to lockfile, so restore original package.json
    await execFile("git", ["checkout", path.join(app, "package.json")]);
  }
})();
