// @noflow
import createLoggerPlugin from '../plugin.js';

test('universal logger log api', async () => {
  const {logger, plugin} = createLoggerPlugin();
  const flags = {
    trace: false,
    debug: false,
    info: false,
    access: false,
    warn: false,
    error: false,
    fatal: false,
  };

  const infoLog = logger.info.bind(logger);

  Object.keys(flags).forEach(flag => {
    logger[flag](`${flag} first arg`, 'second arg');
  });

  class RealLogger {
    trace(message, meta) {
      flags.trace = true;
      expect(message).toBe('trace first arg');
      expect(meta).toBe('second arg');
    }
    debug(message, meta) {
      flags.debug = true;
      expect(message).toBe('debug first arg');
      expect(meta).toBe('second arg');
    }
    info(message, meta) {
      flags.info = true;
      expect(message).toBe('info first arg');
      expect(meta).toBe('second arg');
    }
    access(message, meta) {
      flags.access = true;
      expect(message).toBe('access first arg');
      expect(meta).toBe('second arg');
    }
    warn(message, meta) {
      flags.warn = true;
      expect(message).toBe('warn first arg');
      expect(meta).toBe('second arg');
    }
    error(message, meta) {
      flags.error = true;
      expect(message).toBe('error first arg');
      expect(meta).toBe('second arg');
    }
    fatal(message, meta) {
      flags.fatal = true;
      expect(message).toBe('fatal first arg');
      expect(meta).toBe('second arg');
    }
    createChild() {}
  }

  plugin.provides({logger: new RealLogger()});

  Object.keys(flags).forEach(flag => {
    expect(flags[flag]).toBe(true);
    flags[flag] = false;
    logger[flag](`${flag} first arg`, 'second arg');
    expect(flags[flag]).toBe(true);
  });

  flags.info = false;
  infoLog('info first arg', 'second arg');
  expect(flags.info).toBe(true);
});

test('universal logger with no createChild', async () => {
  const {plugin} = createLoggerPlugin();
  class RealLogger {
    trace() {}
    debug() {}
    info() {}
    access() {}
    warn() {}
    error() {}
    fatal() {}
  }

  expect(() => {
    plugin.provides({logger: new RealLogger()});
  }).not.toThrow();
});

test('universal logger calling setLogger multiple times', async () => {
  const {plugin} = createLoggerPlugin();

  class RealLogger {
    trace() {}
    debug() {}
    info() {}
    access() {}
    warn() {}
    error() {}
    fatal() {}
  }

  expect(() => {
    plugin.provides({logger: new RealLogger()});
    plugin.provides({logger: new RealLogger()});
  }).not.toThrow();
});
