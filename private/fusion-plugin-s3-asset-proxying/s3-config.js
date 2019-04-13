// @noflow
/*eslint-env node */
const fs = require('fs');
const path = require('path');

module.exports = function getConfig({
  secretsPath = path.join(process.cwd(), 'config/secrets/secrets.json'),
} = {}) {
  const {
    s3: {
      aws: prefix,
      aws_access_key_id: accessKeyId,
      aws_secret_access_key: secretAccessKey,
    },
  } = JSON.parse(fs.readFileSync(secretsPath));

  return {
    bucket: 'uber-common-private',
    prefix,
    accessKeyId,
    secretAccessKey,
  };
};
