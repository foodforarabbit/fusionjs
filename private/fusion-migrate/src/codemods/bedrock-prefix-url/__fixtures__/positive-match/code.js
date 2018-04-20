import prefixUrl from '@uber/bedrock/prefixUrl';

export default () => {
  const thing = prefixUrl('static/test.png');
  const otherThing = prefixUrl(thing);
};
