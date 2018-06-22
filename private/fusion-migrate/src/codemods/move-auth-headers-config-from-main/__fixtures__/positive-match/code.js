import App from 'fusion-react';
import {createPlugin} from 'fusion-core';
import AuthHeadersPlugin, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';

// configuration
import atreyuConfig from './config/atreyu';
import fontConfig from './config/fonts';

function thing() {
  const app = new App();
  if (__NODE__) {
    const authHeadersDevConfig = {uuid: process.env.UBER_OWNER_UUID};
    if (typeof authHeadersDevConfig.uuid === 'string') {
      app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    }
  }
  return app;
}
