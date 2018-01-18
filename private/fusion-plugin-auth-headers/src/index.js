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

export default (__NODE__ ? ServerClient : BrowserClient);
