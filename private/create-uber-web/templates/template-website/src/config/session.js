// @flow
import {createPlugin} from 'fusion-core';
import {SecretsToken} from '@uber/fusion-plugin-secrets';

type SessionDeps = {
  Secrets: typeof SecretsToken,
};
type Session = string;

export default createPlugin<SessionDeps, Session>({
  deps: {Secrets: SecretsToken},
  provides({Secrets}) {
    return Secrets.get('server.session.secret');
  },
});
