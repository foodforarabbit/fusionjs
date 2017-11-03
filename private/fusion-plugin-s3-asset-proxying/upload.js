/* eslint-env node */
const util = require('util');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const mime = require('mime');
const mimeDb = require('mime-db');
const AWS = require('aws-sdk');
const loadConfig = require('./s3-config');

module.exports = async (
  {
    directory = path.join(process.cwd(), '.fusion/dist/production/client'),
    s3Config,
  } = {}
) => {
  const files = await util.promisify(fs.readdir)(directory);

  const {
    bucket,
    prefix,
    accessKeyId,
    secretAccessKey,
    s3ForcePathStyle,
    endpoint,
  } =
    s3Config || loadConfig();
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    s3ForcePathStyle,
    endpoint,
  });

  return Promise.all(
    files.map(async filename => {
      const uploadPath = path.join(prefix, filename);
      if (uploadPath.endsWith('.map')) {
        // eslint-disable-next-line no-console
        console.log(`Skipping upload of sourcemap: ${uploadPath}`);
        return Promise.resolve();
      }
      const mimeType = mime.getType(uploadPath);
      const mimeInfo = mimeDb[mimeType];

      // Some extensions (like br) do not have mimeInfo. In that case, do not compress.
      const compressible = mimeInfo && mimeInfo.compressible;

      const fileBuffer = await util.promisify(fs.readFile)(
        path.join(directory, filename)
      );

      const uploadBuffer = compressible
        ? await util.promisify(zlib.gzip)(fileBuffer)
        : fileBuffer;

      return new Promise((resolve, reject) => {
        const contentLength = uploadBuffer.length;
        // eslint-disable-next-line no-console
        console.log(`Uploading: ${uploadPath} - ${contentLength} bytes`);
        return s3.putObject(
          {
            Bucket: bucket,
            Key: uploadPath,
            Body: uploadBuffer,
            ContentType: mimeType,
            ContentLength: contentLength,
            CacheControl: 'max-age=31536000',
            ContentEncoding: compressible ? 'gzip' : null,
          },
          function(uploadError) {
            if (
              uploadError ||
              !this.httpResponse ||
              this.httpResponse.statusCode !== 200
            ) {
              // eslint-disable-next-line no-console
              console.log(`Error uploading: ${uploadPath}`);
              return reject(
                uploadError ||
                  new Error(
                    `Failed to upload ${uploadPath}: ${this.httpResponse}`
                  )
              );
            }

            // eslint-disable-next-line no-console
            console.log(
              `Sucessfully uploaded: ${uploadPath} - ${contentLength} bytes`
            );
            return resolve();
          }
        );
      });
    })
  );
};
