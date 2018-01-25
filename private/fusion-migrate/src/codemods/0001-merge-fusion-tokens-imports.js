module.exports = ({source}) => {
  if (
    source.match(`import {SessionToken} from 'fusion-tokens';`) &&
    source.match(`import {FetchToken} from 'fusion-tokens';`) &&
    source.match(`import {LoggerToken} from 'fusion-tokens';`)
  ) {
    return source
      .replace(
        `import {SessionToken} from 'fusion-tokens';`,
        `import {FetchToken, LoggerToken, SessionToken} from 'fusion-tokens';`
      )
      .replace(`import {FetchToken} from 'fusion-tokens';`, '')
      .replace(`import {LoggerToken} from 'fusion-tokens';`, '');
  }
  return source;
};
