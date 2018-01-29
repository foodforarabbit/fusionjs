const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('fusion-plugin-universal-events-react', '0.3.1'),
  ({source}) => {
    return source.replace(
      `import UniversalEventsPlugin from 'fusion-plugin-universal-events-react';`,
      `import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events-react';`
    );
  },
  ({source}) => {
    return source.replace(
      `const UniversalEvents = app.plugin(UniversalEventsPlugin, {fetch});`,
      `app.register(UniversalEventsToken, UniversalEvents);`
    );
  }
);
