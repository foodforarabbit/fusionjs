# fusion-plugin-analytics-session

Plugin for generating and providing analytics sessions data - such as id, timestamp - in the cookie

## Installation

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

## Usage

```js
// main.js
import AnalyticsSessionPlugin, {UberWebEventCookie} from 'fusion-plugin-analytics-session';
import App from 'fusion-react';
import MyPlugin from './plugins/my-plugin';

export default function start() {
  const app = new App(root);
  const AnalyticsSession = app.plugin(AnalyticsSessionPlugin, {
    cookieType: UberWebEventsCookie
  });
  
  // consumption
  app.plugin(MyPlugin, {AnalyticsSession});
  
  return app;
}

// plugins/my-plugin.js
export default ({AnalyticsSession}) => (ctx, next) => {
  const {session_id, session_time_ms} = AnalyticsSession.of(ctx);
  logData({
    // ...
    sess_id: session_id,
    sess_time: session_time_ms
  });
  return next();
};
```
