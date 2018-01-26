const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('fusion-plugin-csrf-protection', '0.3.1'),
  bump('fusion-plugin-csrf-protection-react', '0.3.2'),
  ({source}) => {
    return source.replace(
      `import CsrfProtectionPlugin from 'fusion-plugin-csrf-protection-react';`,
      `import {FetchToken} from 'fusion-tokens';
import CsrfProtectionPlugin, {
  FetchToken as BaseFetchToken,
} from 'fusion-plugin-csrf-protection-react';`
    );
  },
  ({source}) => {
    return source.replace(
      `const CsrfProtection = app.plugin(CsrfProtectionPlugin, {
    Session,
    fetch: unfetch,
  });
  const {fetch, ignore} = CsrfProtection.of();`,
      `app.register(BaseFetchToken, unfetch);
  app
    .register(FetchToken, CsrfProtectionPlugin)
    .alias(FetchToken, BaseFetchToken);`
    );
  }
);
