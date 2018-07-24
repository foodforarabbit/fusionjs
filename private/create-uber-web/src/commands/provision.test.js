import provision from './provision.js';

test('disabled', async () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  await provision();
  expect(spy.mock.calls[0][0]).toMatch(/disabled/);
});
