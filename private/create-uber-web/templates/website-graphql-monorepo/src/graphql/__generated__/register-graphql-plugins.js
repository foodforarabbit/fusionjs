// @flow
/* istanbul ignore file */
// @generated
import type FusionApp from 'fusion-core';

import {
  UserServicePlugin,
  UserServiceToken,
  UserServiceSchemaPlugin,
  UserServiceSchemaToken,
} from '@uber/graphql-plugin-populous';

import {
  TripServicePlugin,
  TripServiceToken,
  TripServiceSchemaPlugin,
  TripServiceSchemaToken,
} from '@uber/graphql-plugin-trident';

import {
  UserServiceLinkTripServicePlugin,
  UserServiceLinkTripServiceToken,
} from '@uber/graphql-plugin-populous-link-trident';

export default function registerGraphQLPlugins(app: FusionApp) {
  app.register(UserServiceToken, UserServicePlugin);
  app.register(UserServiceSchemaToken, UserServiceSchemaPlugin);

  app.register(TripServiceToken, TripServicePlugin);
  app.register(TripServiceSchemaToken, TripServiceSchemaPlugin);

  app.register(
    UserServiceLinkTripServiceToken,
    UserServiceLinkTripServicePlugin
  );
}
