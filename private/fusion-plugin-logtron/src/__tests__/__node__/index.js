import tape from 'tape-cup';
import Plugin from '../../server';

tape('server plugin interface', t => {
  t.equal(typeof Plugin, 'function', 'exports a default function');

  t.throws(
    () => {
      Plugin({
        team: null,
        appName: 'app',
        UniversalEvents: {},
        M3: {},
      });
    },
    /{team} parameter is required/,
    'enforces team parameter'
  );

  t.throws(
    () => {
      Plugin({
        team: 'team',
        appName: null,
        UniversalEvents: {},
        M3: {},
      });
    },
    /{appName} parameter is required/,
    'enforces appName parameter'
  );

  t.throws(
    () => {
      Plugin({
        team: 'team',
        appName: 'app',
        UniversalEvents: null,
        M3: {},
      });
    },
    /{UniversalEvents} parameter is required/,
    'enforces UniversalEvents parameter'
  );

  t.throws(
    () => {
      Plugin({
        team: 'team',
        appName: 'app',
        UniversalEvents: {},
        M3: null,
      });
    },
    /{M3} parameter is required/,
    'enforces M3 parameter'
  );
  t.end();
});

tape('server plugin basic creation', t => {
  const UniversalEvents = {
    of() {
      return {};
    },
  };
  const M3 = {
    of() {
      return {};
    },
  };
  const Logger = Plugin({
    appName: 'app',
    team: 'team',
    UniversalEvents,
    M3,
  });

  t.equal(typeof Logger.of, 'function', 'exposes an of function');
  const logger = Logger.of();
  t.equal(typeof logger.info, 'function', 'exposes logger functions');
  t.doesNotThrow(
    () => logger.info('hello world', {some: 'data'}),
    'does not throw when logging'
  );
  t.end();
});
