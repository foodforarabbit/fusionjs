import cdnUrl from '@uber/bedrock/cdnUrl';

export default () => {
  const thing = cdnUrl('static/test.png');
  const other = cdnUrl(thing);
};
