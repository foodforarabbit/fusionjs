// @noflow
/* eslint-env node */
const util = require('util');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const mime = require('mime');
const mimeDb = require('mime-db');
const AWS = require('aws-sdk');
const loadConfig = require('./s3-config');
const {version} = require('./package.json');

module.exports = async ({directory, s3Config} = {}) => {
  const defaultDir =
    process.env.FUSION_UPLOAD_DIR ||
    path.join(process.cwd(), '.fusion/dist/production/client');

  directory = directory || defaultDir;

  const files = await util.promisify(fs.readdir)(directory);
  const {
    bucket,
    prefix,
    accessKeyId,
    secretAccessKey,
    endpoint,
    s3ForcePathStyle,
  } = s3Config || loadConfig();

  const svc = process.env.SVC_ID || process.env.npm_package_name;
  const TB_PORT = 18839;
  const tpathEnv = 'prod';
  const tpathPrefix = path.join(
    tpathEnv,
    'web-platform',
    'fusion-upload-assets',
    svc
  );

  let tbS3;
  if (!endpoint) {
    // S3 client for TerraBlob
    tbS3 = new AWS.S3({
      params: {Bucket: 'terrablob'},
      credentials: {
        accessKeyId: svc,
        secretAccessKey: svc,
      },
      customUserAgent: `fusion-plugin-s3-asset-proxying/${version}`,
      httpOptions: {proxy: `http://localhost:${TB_PORT}`},
    });
  }

  // Regular S3 client [deprecated]
  const s3 = new AWS.S3({
    params: {Bucket: bucket},
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    endpoint,
    s3ForcePathStyle,
  });

  return Promise.all(
    files.map(async filename => {
      if (filename.endsWith('.map')) {
        // eslint-disable-next-line no-console
        console.log(`Skipping upload of sourcemap: ${filename}`);
        return Promise.resolve();
      }
      const mimeType = mime.getType(filename);
      const mimeInfo = mimeDb[mimeType];

      // Some extensions (like br) do not have mimeInfo. In that case, do not compress.
      const compressible = mimeInfo && mimeInfo.compressible;

      const fileBuffer = await util.promisify(fs.readFile)(
        path.join(directory, filename)
      );

      const uploadBuffer = compressible
        ? await util.promisify(zlib.gzip)(fileBuffer)
        : fileBuffer;
      const contentLength = uploadBuffer.length;

      const sharedParams = {
        Body: uploadBuffer,
        ContentType: mimeType,
        ContentLength: contentLength,
        CacheControl: 'max-age=31536000',
        ContentEncoding: compressible ? 'gzip' : null,
      };
      const s3path = path.join(prefix, filename);
      const tpath = path.join(tpathPrefix, filename);

      let puts = [];
      if (tbS3) {
        const tbput = tbS3
          .putObject({Key: tpath, ...sharedParams})
          .promise()
          .then(data => {
            console.log(
              `Sucessfully uploaded to TerraBlob: ${tpath} - ${contentLength} bytes`
            );
          })
          .catch(err => {
            console.log(`Failed to upload ${tpath} to TerraBlob: ${err}`, err);
          });
        puts.push(tbput);
      }

      const s3put = s3
        .putObject({Key: s3path, ...sharedParams})
        .promise()
        .then(data => {
          console.log(
            `Sucessfully uploaded to S3: ${s3path} - ${contentLength} bytes`
          );
        })
        .catch(err => {
          console.log(`Failed to upload ${s3path} to S3: ${err}`);
        });
      puts.push(s3put);

      return Promise.all(puts);
    })
  );
};
