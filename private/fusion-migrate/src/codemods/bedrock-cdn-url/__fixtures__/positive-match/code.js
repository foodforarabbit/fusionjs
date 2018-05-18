import cdnUrl from '@uber/bedrock/cdn-url';

export default () => {
  const thing = cdnUrl('static/test.png');
  cdnUrl.init('test');
  const other = cdnUrl(thing);
  console.log(cdnUrl);
};
