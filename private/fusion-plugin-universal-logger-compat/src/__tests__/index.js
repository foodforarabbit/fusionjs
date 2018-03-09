import tape from 'tape-cup';
import createLoggerPlugin from '../plugin.js';

tape('universal logger log api', async t => {
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
      t.equal(message, 'trace first arg', 'trace works');
      t.equal(meta, 'second arg', 'trace works');
    }
    debug(message, meta) {
      flags.debug = true;
      t.equal(message, 'debug first arg', 'debug works');
      t.equal(meta, 'second arg', 'debug works');
    }
    info(message, meta) {
      flags.info = true;
      t.equal(message, 'info first arg', 'info works');
      t.equal(meta, 'second arg', 'info works');
    }
    access(message, meta) {
      flags.access = true;
      t.equal(message, 'access first arg', 'access works');
      t.equal(meta, 'second arg', 'access works');
    }
    warn(message, meta) {
      flags.warn = true;
      t.equal(message, 'warn first arg', 'warn works');
      t.equal(meta, 'second arg', 'warn works');
    }
    error(message, meta) {
      flags.error = true;
      t.equal(message, 'error first arg', 'error works');
      t.equal(meta, 'second arg', 'error works');
    }
    fatal(message, meta) {
      flags.fatal = true;
      t.equal(message, 'fatal first arg', 'fatal works');
      t.equal(meta, 'second arg', 'fatal works');
    }
    createChild() {}
  }

  plugin.provides({logger: new RealLogger()});

  Object.keys(flags).forEach(flag => {
    t.equal(flags[flag], true, `calls ${flag} when buffer flushed`);
    flags[flag] = false;
    logger[flag](`${flag} first arg`, 'second arg');
    t.equal(flags[flag], true, `calls ${flag} after logger set`);
  });

  flags.info = false;
  infoLog('info first arg', 'second arg');
  t.equal(
    flags.info,
    true,
    'proxy works even if using a ref to the original fn'
  );

  t.end();
});
