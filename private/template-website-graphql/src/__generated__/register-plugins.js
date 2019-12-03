// @flow

/* istanbul ignore file */
// @generated
import type App from 'fusion-core';
import UserServicePlugin, {
  UserServiceToken,
} from './infra/populous/user-service-plugin.js';

export default function registerPlugins(app: App) {
  app.register(UserServiceToken, UserServicePlugin);
}
