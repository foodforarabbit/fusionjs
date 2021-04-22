#!/usr/bin/env node

const fs = require("fs");
const child_process = require("child_process");

const FLIPR_BOOTSTRIP_FILE_SAVE_PATH = "flipr";

const [namespace] = process.argv.slice(2);

if (!namespace) {
  console.log(
    "Please provide the Flipr namespace. For example, `update-flipr-bootstrap my-awesome-app`"
  );
  process.exit(1);
}

if (!fs.existsSync("package.json")) {
  console.log(
    `Cannot find "package.json". Make sure this is the root dir of your app.`
  );
  process.exit(1);
}

// Create flipr directory
if (!fs.existsSync(FLIPR_BOOTSTRIP_FILE_SAVE_PATH)) {
  fs.mkdirSync(FLIPR_BOOTSTRIP_FILE_SAVE_PATH, { recursive: true });
  console.log(
    `Created ${FLIPR_BOOTSTRIP_FILE_SAVE_PATH}/ directory to hold flipr config files`
  );
}

console.log(
  "Starting Cerberus tunnel; this may take a while, please wait... (Step 1/3)"
);

try {
  const cerberusPath = child_process
    .execSync("command -v cerberus", {
      encoding: "utf8",
    })
    .trim();
  fs.accessSync(cerberusPath, fs.constants.X_OK);
} catch (err) {
  console.log("Cerberus not found!");
  process.exit(1);
}

const cerberus = child_process.spawn(
  "cerberus",
  ["--no-status-page", "--quiet", "-s", "flipr"],
  { detached: true }
);

(async () => {
  await new Promise((resolve) => {
    cerberus.stdout.on("data", (data) => {
      if (data.includes("READY")) {
        resolve();
      }
    });
  });

  console.log("Downloading Flipr bootstrap file... (Step 2/3)");
  child_process.execSync(
    `curl -H "x-uber-source:flipr" "localhost:14570/properties?namespaces=${namespace}" | jq . > "${FLIPR_BOOTSTRIP_FILE_SAVE_PATH}/${namespace}_flipr_bootstrap.json"`
  );
  console.log("Done retrieving Flipr bootstrap file.");
  console.log("Done! Killing Cerberus... (Step 3/3)");
  process.kill(-cerberus.pid);
})();
