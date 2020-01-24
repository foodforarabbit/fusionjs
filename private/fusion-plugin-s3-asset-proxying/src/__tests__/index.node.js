// @flow
/* eslint-env node */
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

const AWS = require('aws-sdk');

const getConfig = require('../../s3-config.js');
const upload = require('../../upload.js');

test('Server Client', done => {
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

    expect(ctx.status).toBe(200);
    const respBody = await util.promisify(zlib.gunzip)(ctx.body);
    expect(respBody.toString()).toBe('test file content\n');

    const missingCtx = await sim.request('test.txt');
    expect(missingCtx.status).toBe(404);

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
    .then(done)
    // $FlowFixMe
    .catch(done.fail);
});

test('upload with FUSION_UPLOAD_DIR set', done => {
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

    expect(ctx.status).toBe(200);
    const respBody = await util.promisify(zlib.gunzip)(ctx.body);
    expect(respBody.toString()).toBe('test file content\n');

    expect(ctx.response.headers['cache-control']).toBe(
      'public, max-age=31536000'
    );
    expect(ctx.response.headers['timing-allow-origin']).toBe('*');

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
    .then(done)
    // $FlowFixMe
    .catch(done.fail);
});

test('upload with custom response headers', done => {
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

    expect(ctx.status).toBe(200);
    const respBody = await util.promisify(zlib.gunzip)(ctx.body);
    expect(respBody.toString()).toBe('test file content\n');

    expect(ctx.response.headers['cache-control']).toBe(
      headerOverrides['cache-control']
    );
    expect(ctx.response.headers['timing-allow-origin']).toBe(
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
    .then(done)
    // $FlowFixMe
    .catch(done.fail);
});

test('s3 config reading makes sense', () => {
  expect(() =>
    getConfig({secretsPath: `src/__tests__/fixture/inexistent.json`})
  ).toThrow(/Could not find/);
  expect(() =>
    getConfig({secretsPath: `src/__tests__/fixture/invalid_json.txt`})
  ).toThrow(/Invalid JSON/);
  expect(() =>
    getConfig({secretsPath: `src/__tests__/fixture/invalid_secrets.json`})
  ).toThrow(/should be a string/);
});
