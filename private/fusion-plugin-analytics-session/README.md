# @uber/fusion-plugin-analytics-session

Plugin for generating and providing analytics sessions data - such as id, timestamp - in the cookie

---

### Installation

```
yarn add @uber/fusion-plugin-analytics-session
```

## Built-in Cookie Types
### UberWebEventsCookie
[Session cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Session_cookies)
```
{
  session_id: UUID,
  session_time_ms: TIME_STAMP,
}
```

// TODO: Custom cookie types

---

### Example

```js
// main.js
import AnalyticsSessionPlugin, {UberWebEventCookie, AnalyticsCookieTypeToken, AnalyticsSessionToken} from 'fusion-plugin-analytics-session';
import App from 'fusion-react';
import MyPlugin from './plugins/my-plugin';

export default function start() {
  const app = new App(root);
  app.register(AnalyticsSessionToken, AnalyticsSessionPlugin);
  app.register(AnalyticsCookieTypeToken, UberWebEventCookie);
  const AnalyticsSession = app.plugin(AnalyticsSessionPlugin, {
    cookieType: UberWebEventsCookie
  });

  // consumption
  app.middleware({session: AnalyticsSessionToken}, ({session}) => {
    return (ctx, next) => {
      const {session_id, session_time_ms} = session.from(ctx);
      return next();
    }
  });
  return app;
}
```