import tape from 'tape-cup';
import Plugin from '../../server';

tape('server plugin interface', t => {
  t.equal(typeof Plugin, 'function', 'exports a default function');

  t.throws(
    () => {
      Plugin({
        team: null,
        service: 'app',
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
        service: null,
        UniversalEvents: {},
        M3: {},
      });
    },
    /{service} parameter is required/,
    'enforces service parameter'
  );

  t.throws(
    () => {
      Plugin({
        team: 'team',
        service: 'app',
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
        service: 'app',
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
    service: 'app',
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
