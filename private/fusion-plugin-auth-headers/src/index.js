// @flow
import ServerClient from './server.js';
import BrowserClient from './browser.js';

export {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
  AuthHeadersEmailConfigToken,
  AuthHeadersTokenConfigToken,
  AuthHeadersRolesConfigToken,
  AuthHeadersGroupsConfigToken,
} from './tokens';

export type {AuthHeadersService} from './server';

declare var __NODE__: Boolean;
export default __NODE__ ? ServerClient : BrowserClient;
