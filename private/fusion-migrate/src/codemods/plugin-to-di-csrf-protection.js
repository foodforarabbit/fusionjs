const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import CsrfProtectionPlugin from 'fusion-plugin-csrf-protection-react';`,
      `import {FetchToken} from 'fusion-tokens';
import CsrfProtectionPlugin, {FetchToken as BaseFetchToken} from 'fusion-plugin-csrf-protection-react';`
    );
  },
  ({source}) => {
    return source.replace(
      `const CsrfProtection = app.plugin(CsrfProtectionPlugin, {
    Session,
    fetch: unfetch,
  });`,
      `app.configure(BaseFetchToken, unfetch);
  app.register(FetchToken, CsrfProtectionPlugin).alias(FetchToken, BaseFetchToken);`
    );
  }
);
