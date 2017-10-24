export default function(events) {
  const makeFn = type => payload => events.emit(`m3:${type}`, payload);
  const types = ['counter', 'increment', 'decrement', 'timing', 'gauge'];
  return types.reduce((m3, nextType) => {
    m3[nextType] = makeFn(nextType);
    return m3;
  }, {});
}
