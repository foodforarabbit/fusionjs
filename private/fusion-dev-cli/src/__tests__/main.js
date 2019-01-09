// @flow
const {escape} = require('querystring');

function mock() {
  const cp = require('child_process');
  const https = require('https');

  const timeline = [];
  const analytics = [];

  const emitter = () => ({
    on(type, cb) {
      cb(0);
    },
  });

  // mock shell
  jest.spyOn(cp, 'spawn').mockImplementation((...args) => {
    timeline.push(args.slice(0, -1));
    return emitter();
  });

  // mock network
  let statusCode = 500;
  jest.spyOn(https, 'request').mockImplementation((options, cb) => {
    if (options.path.includes('analytics')) {
      analytics.push(options.path);
      cb({...emitter(), statusCode: 200});
    } else {
      cb({...emitter(), statusCode});
      statusCode = 200;
    }
    return {...emitter(), end() {}};
  });

  return {timeline, analytics};
}

test('cli works', async () => {
  const {timeline, analytics} = mock();
  const email = (process.env.UBER_OWNER = '_no_one_@uber.com');

  await require('../main.js').run(['node', '../cli.js', 'echo', '1']);

  expect(timeline).toEqual([
    ['ussh'],
    ['cerberus', ['--no-status-page']],
    ['echo', ['1']],
  ]);

  expect(analytics).toEqual([
    `/api/analytics?email=${escape(email)}&service=${escape(
      '@uber/fusion-dev-cli'
    )}&command=echo&args=1`,
  ]);
});

test('cerberus flag works', async () => {
  const {timeline} = mock();

  await require('../main.js').run(['node', '../cli.js', '--no-cerberus', 'ls']);

  expect(timeline).toEqual([['ls', []]]);
});
