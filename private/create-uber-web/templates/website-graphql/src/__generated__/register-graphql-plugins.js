// @flow

/* istanbul ignore file */
// @generated
import type FusionApp from 'fusion-core';
import UserServiceSchemaPlugin, {
  UserServiceSchemaToken,
} from '../graphql/populous/user-service-resolver.js';

export default function registerGraphQLPlugins(app: FusionApp) {
  app.register(UserServiceSchemaToken, UserServiceSchemaPlugin);
}
