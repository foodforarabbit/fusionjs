/*eslint-env node */

export default async function getConfig(Secrets) {
  const secrets = Secrets.of();
  return {
    bucket: 'uber-common-private',
    prefix: secrets.get('s3.aws'),
    accessKeyId: secrets.get('s3.aws_access_key_id'),
    secretAccessKey: secrets.get('s3.aws_secret_access_key'),
  };
}
