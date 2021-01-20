/**
 * @jest-environment node
 */

const { spawn, execSync } = require("child_process");
const getPort = require("get-port");
const S3rver = require("s3rver");
const fetch = require("node-fetch");
const AWS = require("aws-sdk");
const upload = require("@uber/fusion-plugin-s3-asset-proxying/upload.js");
const { promisify } = require("util");
const treeKill = require('tree-kill');

let fusionPort;
let s3Server;
let fusionServer;

test("Fusion server proxies to s3 for non-local assets", async () => {
  const res = await fetch(
    `http://localhost:${fusionPort}/_static/s3-asset.json`
  );
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toStrictEqual({ s3: "asset" });
});

test("Fusion server still serves local assets", async () => {
  const res = await fetch(
    `http://localhost:${fusionPort}/_static/351b4d087e0f0a0ad4cfe12d785fd9c9.json`
  );
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toStrictEqual({ fusion: "asset" });
});

beforeAll(async () => {

  execSync("yarn fusion build --production", {
    cwd: __dirname,
    env: {
      ...process.env,
      NODE_ENV: "production"
    },
    stdio: "inherit"
  });

  const s3Port = await getPort();

  s3Server = await new Promise((resolve, reject) => {
    const server = new S3rver({
      port: s3Port,
      hostname: "localhost",
      silent: false,
      directory: `${__dirname}/s3-storage`
    }).run(err => {
      if (err) return reject(err);
      return resolve(server);
    });
  });

  const s3Config = {
    bucket: "test-bucket",
    prefix: "",
    s3ForcePathStyle: true,
    accessKeyId: "ACCESS_KEY_ID",
    secretAccessKey: "SECRET_ACCESS_KEY",
    endpoint: new AWS.Endpoint(`http://localhost:${s3Port}`)
  };

  const s3 = new AWS.S3(s3Config);
  await promisify(s3.createBucket.bind(s3))({ Bucket: s3Config.bucket });

  await upload({
    directory: `${__dirname}/s3-assets`,
    s3Config
  });

  fusionPort = await getPort();

  fusionServer = spawn("yarn", ["fusion", "start"], {
    cwd: __dirname,
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT_HTTP: fusionPort,
      S3_PORT: s3Port
    }
  });

  fusionServer.on("error", err => {
    throw err;
  });

  await waitForServer(fusionPort);

  console.log("Fusion", `http://localhost:${fusionPort}`);
});

afterAll(async () => {
  if (fusionServer) {
    // Note: doesn't work with yarn berry for now:
    // https://github.com/yarnpkg/berry/issues/1741#issuecomment-678754626
    // fusionServer.kill("SIGKILL");

    // So we kill tree of subprocesses instead
    treeKill(fusionServer.pid);
  }
  await promisify(s3Server.close.bind(s3Server))();
});

async function waitForServer(port) {
  let started = false;
  let numTries = 0;
  let res;
  while (!started && numTries < 20) {
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      res = await fetch(`http://localhost:${port}/`, {
        headers: {
          accept: "text/html"
        }
      });
      started = true;
    } catch (e) {
      if (e.statusCode === 500) {
        started = true;
        res = e.response.body;
      } else {
        numTries++;
      }
    }
  }
  if (!started) {
    throw new Error("Failed to start server");
  }
  return res;
}
