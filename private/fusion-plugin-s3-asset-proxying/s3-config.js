/*eslint-env node */
const util = require('util');
const fs = require('fs');
const path = require('path');

module.exports = async function getConfig(
  {secretsPath = path.join(process.cwd(), 'config/secrets/secrets.json')} = {}
) {
  const {
    s3: {
      aws: prefix,
      aws_access_key_id: accessKeyId,
      aws_secret_access_key: secretAccessKey,
    },
  } = JSON.parse(await util.promisify(fs.readFile)(secretsPath));

  return {
    bucket: 'uber-common-private',
    prefix,
    accessKeyId,
    secretAccessKey,
  };
};
