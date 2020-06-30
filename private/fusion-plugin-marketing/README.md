# @uber/fusion-plugin-marketing

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Fusion.js plugin for web marketing attributions. Previously @uber/node-marketing-utils on Bedrock.
1. Generates a persistent UUID in cookie on a root domain to identify a non-auth visitor.
2. Publish server requests to Heatpipe with the the UUID for attributions at conversions.
3. Optional MarketingBrowserPlugin to send tracking information to the server for situations where page is served from cache

See ["RFC - Uber Cookie and New Marketing Attribution"](https://docs.google.com/document/d/1NXNfqN-P5wp0hglbJkj39DpFAFUTlL3Uou3T56pu5Ko/edit?usp=drive_web&ouid=115611216150329318223) for more information.

---

## Installation

```sh
yarn add @uber/fusion-plugin-marketing
```

---

## Usage

### Getting the UUID

```js
app.middleware(({Marketing: UberMarketingToken}) => (ctx, next) => {
  const marketing = Marketing.from(ctx);
  const cookieId = marketing.getCookieId();
  // ...
});
```

---

### Setup (server-side only - default setup)

```js
// src/app.js
import UberMarketingPlugin, {
  UberMarketingToken,
  UberMarketingConfigToken,
} from '@uber/fusion-plugin-marketing';

export default () => {
  const app = new App(...);
  // ...
  app.register(UberMarketingToken, UberMarketingPlugin);
  // ...
  return app;
};
```

### Setup with CanActivateToken configuration

```js
// src/app.js
import UberMarketingPlugin, {
  UberMarketingToken,
  UberMarketingConfigToken,
  UberMarketingCanActivateToken,
} from '@uber/fusion-plugin-marketing';
import FliprPlugin, {FliprToken} from '@uber/fusion-plugin-flipr';

const CustomCanActivatePlugin = createPlugin({
    deps: {
      flipr: FliprToken,
    },
    provides: async ({flipr}) => {
        return {
          canActivate: await flipr.get('some.flipr.boolean'),
        }
    }
});

export default () => {
  const app = new App(...);
  // ...
  app.register(UberMarketingCanActivateToken, CustomCanActivatePlugin)
  app.register(UberMarketingToken, UberMarketingPlugin);
  // ...
  return app;
};
```

### Setup with MarketingBrowserPlugin
note: the server-side plugin is still required to handle the api call from the client-side plugin

the cookie_id and session_id used in the heatpipe event is returned
- if these values were not already set as cookies and sent in the request then they will be generated server-side
- see CustomPlugin for usage
```js
// src/app.js
import UberMarketingPlugin, {
  MarketingBrowserPlugin,
  UberMarketingToken,
  UberMarketingBrowserToken,
} from '@uber/fusion-plugin-marketing';

const CustomPlugin = createPlugin({
    deps: {
      MarketingPlugin: UberMarketingBrowserToken,
    },
    middleware({MarketingPlugin}) {
      return async (ctx: Context, next) => {
        const marketing = MarketingPlugin.from(ctx);
        const responseFromServerPlugin = marketing.getTrackResponse();
        console.log('do something with marketing and analytics session tokens, cookie_id and session_id respectively, such as setting it to a cookie', {
          responseFromServerPlugin
        })
        return next();
      };
    },
});

export default () => {
  const app = new App(...);
  // ...
  if (__NODE__) {
    app.register(UberMarketingToken, UberMarketingPlugin);
  } else {
    app.register(UberMarketingBrowserToken, MarketingBrowserPlugin);
    app.register(CustomPlugin)
  }
  // ...
  return app;
};
```

---

## API

### Registration API

See ["Setup"](#setup)

### Dependencies

#### `UberMarketingConfigToken`

Optional. The configuration. Mainly for overriding cookie settings.
```
export type PluginConfig = {
  cookieAge: number,
  cookieIdKey: string,
  serverDomain: string, // by default derived from the HTTP `host` header OR 'UNKNOWN'
  cookieDomain: string, // by default derived root domain from serverDomain OR null
  disableHeatpipe: boolean,
  debugLogging: boolean, // by default will not log on successful heatpipe publish
};
```

##### Example

```
app.register(UberMarketingConfigToken, {
  cookieDomain: '.ubereats.com',
  serverDomain: 'awesome.ubereats.com',
});
```
#### `HeatpipeToken`

see [@uber/fusion-plugin-heatpipe](https://code.uberinternal.com/diffusion/WEFUSVQ/)

#### `LoggerToken`

see [@uber/fusion-plugin-logtron-react](https://code.uberinternal.com/diffusion/WEFUSIV/)

#### Service API

##### Get the request instance
```js
const marketing = Marketing.from(ctx);
```

##### Get UUID
see ["Getting the UUID"](#getting-the-uuid)

---

## Developing fusion-plugin-marketing

Write tests. Add **Web Platform** to your diffs as a code reviewer.

## Ownership

This Plugin is authored by **Web Platform** <eng-web-platform@uber.com>.
