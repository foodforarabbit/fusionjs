const {upgrade} = require('../upgrade.js');

test('upgrade', async () => {
  let mock1 = 0;
  let mock2 = 0;
  let mock3 = 0;
  await upgrade([
    async () => mock1++,
    async () => mock2++,
    async () => mock3++,
  ]);
  expect(mock1).toBe(1);
  expect(mock2).toBe(1);
  expect(mock3).toBe(1);
});
