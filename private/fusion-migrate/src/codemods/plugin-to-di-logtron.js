const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import LoggerPlugin from '@uber/fusion-plugin-logtron';`,
      `import {LoggerToken} from 'fusion-tokens';
  import {TeamConfigToken} from '@uber/fusion-tokens';
  import LoggerPlugin, {SentryConfigToken} from '@uber/fusion-plugin-logtron';`
    );
  },
  ({source}) => {
    return source.replace(
      `const Logger = app.plugin(LoggerPlugin, {
    UniversalEvents,
    M3,
    team,
    service,
    backends: {sentry: sentryConfig},
  });`,
      `app.configure(TeamConfigToken, team);
  app.configure(SentryConfigToken, sentryConfig);
  app.register(LoggerToken, LoggerPlugin);`
    );
  }
);
