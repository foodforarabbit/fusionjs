import ServerLogger from "./server";
import BrowserLogger from "./browser";

export default (__NODE__ ? ServerLogger : BrowserLogger);
