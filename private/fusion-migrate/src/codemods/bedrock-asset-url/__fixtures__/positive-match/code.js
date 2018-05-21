import assetUrl from '@uber/bedrock/asset-url';

assetUrl('/javascripts/main.js');

export default () => {
  const a = assetUrl('/static/test.png');
  const b = assetUrl('/stylesheets/main.css');
  const c = assetUrl('/stylesheets/test.css');
  assetUrl.init('test');
  console.log(assetUrl);
  return (
    <div>
      <script src={assetUrl('/javascripts/main.js')} />
    </div>
  );
};
