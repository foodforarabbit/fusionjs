const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import UniversalEventsPlugin from 'fusion-plugin-universal-events-react';`,
      `import UniversalEventsPlugin, {UniversalEventsToken} from 'fusion-plugin-universal-events-react';`
    );
  },
  ({source}) => {
    return source.replace(
      `const UniversalEvents = app.plugin(UniversalEventsPlugin, {fetch});`,
      `app.register(UniversalEventsToken, UniversalEvents);`
    );
  }
);
