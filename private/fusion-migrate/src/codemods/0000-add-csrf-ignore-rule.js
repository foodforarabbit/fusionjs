module.exports = ({source}) => {
  if (
    source.match('fusion-plugin-csrf-protection') && // has csrf protection plugin
    source.match('fusion-plugin-error-handling') && // has error handling plugin
    !source.match('CsrfIgnoreRoutesToken') // does not have ignore rule configured yet
  ) {
    return source
      .replace(
        `import CsrfProtection, {
  CsrfIgnoreRoutesToken,
  FetchForCsrfToken,
} from 'fusion-plugin-csrf-protection-react';`,
        `import {FetchToken} from 'fusion-tokens';
import CsrfProtection, {
  FetchForCsrfToken,
} from 'fusion-plugin-csrf-protection-react';`
      )
      .replace(
        `app.register(FetchToken, CsrfProtectionPlugin);`,
        `app.register(FetchToken, CsrfProtectionPlugin);
  __NODE__ && app.register(CsrfIgnoreRoutesToken, ['/_errors']);`
      );
  } else {
    return source;
  }
};
