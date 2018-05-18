import prefixUrl from '@uber/bedrock/prefix-url';

export default () => {
  const thing = prefixUrl('static/test.png');
  prefixUrl.init('hello world');
  const otherThing = prefixUrl(thing);
};
