const composeVisitors = require('../compose-visitors.js');

test('composeVisitors', async () => {
  const visitorA = {
    one: jest.fn(),
    two: jest.fn(),
    three: jest.fn(),
  };
  const visitorB = {
    two: jest.fn(),
    three: jest.fn(),
    four: jest.fn(),
  };

  const composed = composeVisitors(visitorA, visitorB);
  expect(Object.keys(composed)).toMatchObject(['one', 'two', 'three', 'four']);
  composed.one('first-arg', 'second-arg');
  expect(visitorA.one.mock.calls[0][0]).toEqual('first-arg');
  expect(visitorA.one.mock.calls[0][1]).toEqual('second-arg');

  expect(visitorA.two.mock.calls).toHaveLength(0);
  expect(visitorB.two.mock.calls).toHaveLength(0);

  composed.two('first-arg', 'second-arg');
  expect(visitorA.two.mock.calls[0][0]).toEqual('first-arg');
  expect(visitorA.two.mock.calls[0][1]).toEqual('second-arg');
  expect(visitorB.two.mock.calls[0][0]).toEqual('first-arg');
  expect(visitorB.two.mock.calls[0][1]).toEqual('second-arg');

  composed.three('three', 'three-second');
  expect(visitorA.three.mock.calls[0][0]).toEqual('three');
  expect(visitorA.three.mock.calls[0][1]).toEqual('three-second');
  expect(visitorB.three.mock.calls[0][0]).toEqual('three');
  expect(visitorB.three.mock.calls[0][1]).toEqual('three-second');
});
