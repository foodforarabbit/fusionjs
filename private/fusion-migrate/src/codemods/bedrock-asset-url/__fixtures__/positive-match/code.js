import assetUrl from '@uber/bedrock/asset-url';

export default () => {
  const a = assetUrl('/static/test.png');
  const b = assetUrl('/stylesheets/main.css');
  const c = assetUrl('/stylesheets/test.css');
};
