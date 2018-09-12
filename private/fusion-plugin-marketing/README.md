# @uber/fusion-plugin-marketing

Fusion.js plugin for web marketing attributions. Previously @uber/node-marketing-utils on Bedrock.
1. Generates a persistent UUID in cookie on a root domain to identify a non-auth visitor.
2. Publish server requests to Heatpipe with the the UUID for attributions at conversions.

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

### Setup

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
  // SPECIFY YOUR DOMAIN NAME
  app.register(UberMarketingConfigToken, {
  	serverDomain: 'awesome.uber.com',
  });
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

Required. The configuration.
```
export type PluginConfig = {
  cookieAge: number,
  cookieIdKey: string,
  cookieDomain: string, // REQUIRED IF APP NOT DEPLOYED ON *.uber.com
  serverDomain: string, // REQUIRED, SPECIFY YOUR DOMAIN NAME
  disableHeatpipe: boolean,
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
