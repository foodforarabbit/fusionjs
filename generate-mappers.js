// @flow

const cp = require("child_process");

const workspaces = cp
  .execSync("yarn workspaces list --json")
  .toString()
  .trim()
  .split("\n")
  .map((json) => JSON.parse(json));

const mappers = [];
for (let workspace of workspaces) {
  if (workspace.location === ".") {
    continue;
  }
  mappers.push(
    `module.name_mapper='${workspace.name}' -> '<PROJECT_ROOT>/${workspace.location}/'`
  );
}

console.log(mappers.join("\n") + "\n");
