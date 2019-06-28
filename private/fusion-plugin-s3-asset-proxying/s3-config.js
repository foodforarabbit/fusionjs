// @noflow
/*eslint-env node */
const fs = require('fs');
const path = require('path');

const read = (file, error) => {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (e) {
    throw new Error(error);
  }
};
const parse = (data, file) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    throw new Error(`Invalid JSON in file ${file}`);
  }
};
const ensure = (obj, fn, error) => {
  try {
    const value = fn(obj);
    if (typeof value === 'string') return value;
    else throw new Error(error);
  } catch (e) {
    throw new Error(error);
  }
};

module.exports = function getConfig({
  secretsPath = path.join(process.cwd(), 'config/secrets/secrets.json'),
} = {}) {
  const langleyError = `Could not find ${secretsPath}. Setup Langley and set \`uses_langley_build_secrets: true\` in your pinocchio file`;
  const secrets = parse(read(secretsPath, langleyError), secretsPath);
  const prefix = ensure(
    secrets,
    s => s.s3.aws,
    `s3.aws in ${secretsPath} should be a string. Set it up in Langley`
  );
  const accessKeyId = ensure(
    secrets,
    s => s.s3.aws_access_key_id,
    `s3.aws_access_key_id in ${secretsPath} should be a string. Set it up in Langley`
  );
  const secretAccessKey = ensure(
    secrets,
    s => s.s3.aws_secret_access_key,
    `s3.aws_secret_access_key in ${secretsPath} should be a string. Set it up in Langley`
  );

  return {
    bucket: 'uber-common-private',
    prefix,
    accessKeyId,
    secretAccessKey,
  };
};
