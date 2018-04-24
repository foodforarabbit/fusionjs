import prefixUrl from '@uber/bedrock/prefix-url';

export default () => {
  const thing = prefixUrl('static/test.png');
  const otherThing = prefixUrl(thing);
};
