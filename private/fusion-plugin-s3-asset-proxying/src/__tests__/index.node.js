// @flow
/* eslint-env node */
import test from 'tape-cup';
import S3rver from 's3rver';
import getPort from 'get-port';
import tmp from 'tmp';
import path from 'path';
import util from 'util';
import zlib from 'zlib';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {S3ConfigToken, AssetProxyingResponseHeaderOverrides} from '../tokens';
import AssetProxyingPlugin from '../server.js';

// $FlowFixMe hack due to cup limitation
const getConfig = require('../s3-config.js'); // eslint-disable-line import/no-unresolved
const AWS = require('aws-sdk');

// weird path because things are built to 'dist-test'
// $FlowFixMe hack due to cup limitation
const upload = require('../upload.js'); // eslint-disable-line import/no-unresolved

test('Server Client', t => {
  (async () => {
    const {tmpPath, cleanup} = await new Promise((resolve, reject) => {
      tmp.dir((err, tmpPath, cleanup) => {
        if (err) return reject(err);
        return resolve({tmpPath, cleanup});
      });
    });

    const port = await getPort();
    const s3Config = {
      bucket: 'test-bucket',
      // It would be nice to use a 'test-prefix' here, but there are some issues with s3rver:
      // * You cannot close s3rver unless it is empty: "error: [S3rver] uncaughtException: ENOTEMPTY: directory not empty"
      // * We can solve this by deleting the bucket below
      // * In order to delete a bucket, it needs to be empty: "BucketNotEmpty"
      // * We can solve this by deleting "test.txt" below
      // * However, when we delete it, it leaves behind an empty 'test-prefix/' directory that again results in "not empty" errors
      // * Despite a few different tries, I can't find a way to delete that empty dir with the AWS.S3 client and s3rver
      // * maybe we can just rimraf 'tmpPath/test-bucket' instead?
      prefix: '',
      s3ForcePathStyle: true,
      accessKeyId: 'ACCESS_KEY_ID',
      secretAccessKey: 'SECRET_ACCESS_KEY',
      endpoint: new AWS.Endpoint(`http://localhost:${port}`),
    };

    const server = await new Promise((resolve, reject) => {
      const server = new S3rver({
        hostname: 'localhost',
        port,
        silent: false,
        directory: tmpPath,
      }).run(err => {
        if (err) return reject(err);
        return resolve(server);
      });
    });

    const s3 = new AWS.S3(s3Config);
    await util.promisify(s3.createBucket.bind(s3))({Bucket: s3Config.bucket});

    const app = new App('el', el => el);
    app.register(S3ConfigToken, s3Config);
    app.register(AssetProxyingPlugin);

    await upload({
      directory: path.join(process.cwd(), 'src/__tests__/fixture-files'),
      s3Config,
    });

    const sim = getSimulator(app);
    const ctx = await sim.request('/_static/test.txt');

    t.equal(ctx.status, 200, 'fetch test file 200');
    const respBody = await util.promisify(zlib.gunzip)(ctx.body);
    t.equal(
      respBody.toString(),
      'test file content\n',
      'can fetch test file contents'
    );

    const missingCtx = await sim.request('test.txt');
    t.equal(missingCtx.status, 404, 'fetch no prefix 404');

    await util.promisify(s3.deleteObjects.bind(s3))({
      Bucket: s3Config.bucket,
      Delete: {
        Objects: [{Key: path.join(s3Config.prefix, 'test.txt')}],
      },
    });

    await util.promisify(s3.deleteBucket.bind(s3))({Bucket: s3Config.bucket});

    await util.promisify(server.close.bind(server))();

    cleanup();
  })()
    .then(t.end)
    .catch(t.fail);
});

test('upload with FUSION_UPLOAD_DIR set', t => {
  (async () => {
    const {tmpPath, cleanup} = await new Promise((resolve, reject) => {
      tmp.dir((err, tmpPath, cleanup) => {
        if (err) return reject(err);
        return resolve({tmpPath, cleanup});
      });
    });

    const port = await getPort();
    const s3Config = {
      bucket: 'test-bucket',
      // It would be nice to use a 'test-prefix' here, but there are some issues with s3rver:
      // * You cannot close s3rver unless it is empty: "error: [S3rver] uncaughtException: ENOTEMPTY: directory not empty"
      // * We can solve this by deleting the bucket below
      // * In order to delete a bucket, it needs to be empty: "BucketNotEmpty"
      // * We can solve this by deleting "test.txt" below
      // * However, when we delete it, it leaves behind an empty 'test-prefix/' directory that again results in "not empty" errors
      // * Despite a few different tries, I can't find a way to delete that empty dir with the AWS.S3 client and s3rver
      // * maybe we can just rimraf 'tmpPath/test-bucket' instead?
      prefix: '',
      s3ForcePathStyle: true,
      accessKeyId: 'ACCESS_KEY_ID',
      secretAccessKey: 'SECRET_ACCESS_KEY',
      endpoint: new AWS.Endpoint(`http://localhost:${port}`),
    };

    const server = await new Promise((resolve, reject) => {
      const server = new S3rver({
        hostname: 'localhost',
        port,
        silent: false,
        directory: tmpPath,
      }).run(err => {
        if (err) return reject(err);
        return resolve(server);
      });
    });

    const s3 = new AWS.S3(s3Config);
    await util.promisify(s3.createBucket.bind(s3))({Bucket: s3Config.bucket});

    const app = new App('el', el => el);
    app.register(S3ConfigToken, s3Config);
    app.register(AssetProxyingPlugin);

    process.env.FUSION_UPLOAD_DIR = path.join(
      process.cwd(),
      'src/__tests__/fixture-files'
    );
    await upload({
      s3Config,
    });

    const sim = getSimulator(app);
    const ctx = await sim.request('/_static/test.txt');

    t.equal(ctx.status, 200, 'fetch test file 200');
    const respBody = await util.promisify(zlib.gunzip)(ctx.body);
    t.equal(
      respBody.toString(),
      'test file content\n',
      'can fetch test file contents'
    );

    t.equal(ctx.response.headers['cache-control'], 'public, max-age=31536000');
    t.equal(ctx.response.headers['timing-allow-origin'], '*');

    await util.promisify(s3.deleteObjects.bind(s3))({
      Bucket: s3Config.bucket,
      Delete: {
        Objects: [{Key: path.join(s3Config.prefix, 'test.txt')}],
      },
    });

    await util.promisify(s3.deleteBucket.bind(s3))({Bucket: s3Config.bucket});

    await util.promisify(server.close.bind(server))();

    cleanup();
  })()
    .then(t.end)
    .catch(t.fail);
});

test('upload with custom response headers', t => {
  (async () => {
    const {tmpPath, cleanup} = await new Promise((resolve, reject) => {
      tmp.dir((err, tmpPath, cleanup) => {
        if (err) return reject(err);
        return resolve({tmpPath, cleanup});
      });
    });

    const port = await getPort();
    const s3Config = {
      bucket: 'test-bucket',
      prefix: '',
      s3ForcePathStyle: true,
      accessKeyId: 'ACCESS_KEY_ID',
      secretAccessKey: 'SECRET_ACCESS_KEY',
      endpoint: new AWS.Endpoint(`http://localhost:${port}`),
    };

    const server = await new Promise((resolve, reject) => {
      const server = new S3rver({
        hostname: 'localhost',
        port,
        silent: false,
        directory: tmpPath,
      }).run(err => {
        if (err) return reject(err);
        return resolve(server);
      });
    });

    const s3 = new AWS.S3(s3Config);
    await util.promisify(s3.createBucket.bind(s3))({Bucket: s3Config.bucket});

    const app = new App('el', el => el);
    const headerOverrides = {
      'cache-control': 'max-age=0',
      'timing-allow-origin': 'https://evilcorp.com',
    };
    app.register(AssetProxyingResponseHeaderOverrides, headerOverrides);
    app.register(S3ConfigToken, s3Config);
    app.register(AssetProxyingPlugin);

    process.env.FUSION_UPLOAD_DIR = path.join(
      process.cwd(),
      'src/__tests__/fixture-files'
    );
    await upload({
      s3Config,
    });

    const sim = getSimulator(app);
    const ctx = await sim.request('/_static/test.txt');

    t.equal(ctx.status, 200, 'fetch test file 200');
    const respBody = await util.promisify(zlib.gunzip)(ctx.body);
    t.equal(
      respBody.toString(),
      'test file content\n',
      'can fetch test file contents'
    );

    t.equal(
      ctx.response.headers['cache-control'],
      headerOverrides['cache-control']
    );
    t.equal(
      ctx.response.headers['timing-allow-origin'],
      headerOverrides['timing-allow-origin']
    );

    await util.promisify(s3.deleteObjects.bind(s3))({
      Bucket: s3Config.bucket,
      Delete: {
        Objects: [{Key: path.join(s3Config.prefix, 'test.txt')}],
      },
    });

    await util.promisify(s3.deleteBucket.bind(s3))({Bucket: s3Config.bucket});

    await util.promisify(server.close.bind(server))();

    cleanup();
  })()
    .then(t.end)
    .catch(t.fail);
});

test('s3 config reading makes sense', t => {
  t.throws(
    () => getConfig({secretsPath: `src/__tests__/fixture/inexistent.json`}),
    /Could not find/,
    'inexistent file has meaningful error'
  );
  t.throws(
    () => getConfig({secretsPath: `src/__tests__/fixture/invalid_json.txt`}),
    /Invalid JSON/,
    'invalid json has meaninful error'
  );
  t.throws(
    () =>
      getConfig({secretsPath: `src/__tests__/fixture/invalid_secrets.json`}),
    /should be a string/,
    'invalid configs has meaningful error'
  );
  t.end();
});
