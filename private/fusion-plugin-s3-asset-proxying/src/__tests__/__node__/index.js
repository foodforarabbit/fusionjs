/* eslint-env node */
import test from 'tape-cup';
import S3rver from 's3rver';
import getPort from 'get-port';
import tmp from 'tmp';
import path from 'path';
import util from 'util';
import zlib from 'zlib';
const AWS = require('aws-sdk');
import AssetProxyingPlugin from '../../index.js';
// weird path because things are built to 'dist-test'
const upload = require('../upload.js');

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

    const plugin = AssetProxyingPlugin({
      config: s3Config,
    });
    const proxy = plugin.of();
    await proxy.init();

    await upload({
      directory: path.join(process.cwd(), 'src/__tests__/fixture-files'),
      s3Config,
    });

    const ctx = {status: 404, path: 'test.txt', method: 'GET', set: () => {}};
    const next = () => {};
    await plugin.middleware(ctx, next);

    t.equal(ctx.status, 200, 'fetch test file 200');
    const respBody = await util.promisify(zlib.gunzip)(ctx.body);
    t.equal(
      respBody.toString(),
      'test file content\n',
      'can fetch test file contents'
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
