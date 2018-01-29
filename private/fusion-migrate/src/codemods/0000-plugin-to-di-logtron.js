const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-logtron', '0.3.2'),
  ({source}) => {
    return source.replace(
      `import LoggerPlugin from '@uber/fusion-plugin-logtron';`,
      `import {LoggerToken} from 'fusion-tokens';
import LoggerPlugin, {
  LogtronTeamToken,
  LogtronBackendsToken,
} from '@uber/fusion-plugin-logtron';`
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
      `app.register(LoggerToken, LoggerPlugin);
  app.register(LogtronTeamToken, team);
  app.register(LogtronBackendsToken, {backends: {sentry: sentryConfig}});`
    );
  }
);
