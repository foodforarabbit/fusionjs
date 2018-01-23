import ServerLogger, {BackendsToken, TeamToken} from './server';
import BrowserLogger from './browser';

export {default as mock} from './mock';

export default (__NODE__ ? ServerLogger : BrowserLogger);

export const LogtronBackendsToken = BackendsToken;
export const LogtronTeamToken = TeamToken;
