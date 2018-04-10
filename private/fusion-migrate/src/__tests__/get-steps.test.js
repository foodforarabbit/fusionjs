const getSteps = require('../get-steps.js');

test('getSteps 14', async () => {
  const steps = getSteps({version: 14});
  expect(Array.isArray(steps)).toEqual(true);
  steps.forEach(s => {
    expect(typeof s.id).toEqual('string');
    expect(typeof s.step).toEqual('function');
  });
  expect(steps.length).toBeGreaterThan(0);
});

test('getSteps 13', async () => {
  const steps = getSteps({version: 13});
  expect(Array.isArray(steps)).toEqual(true);
  steps.forEach(s => {
    expect(typeof s.id).toEqual('string');
    expect(typeof s.step).toEqual('function');
  });
  expect(steps.length).toBeGreaterThan(0);
});
