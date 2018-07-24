// @flow
import {createPlugin} from 'fusion-core';
import {SecretsToken} from '@uber/fusion-plugin-secrets';

export default createPlugin({
  deps: {Secrets: SecretsToken},
  provides({Secrets}) {
    return Secrets.get('server.session.secret');
  },
});
