# TChannel plugin for fusion

This is a fusion plugin for Tchannel and hyperbahn. It's a required dependency for [`@uber/fusion-plugin-atreyu`](/web/api/uber-fusion-plugin-atreyu)

This plugin will attempt to connect to Uber infrastructure. You must have `cerberus` running in order for it to work.

To update cerberus, run:

```sh
brew update && brew reinstall cerberus
```

To start it, make sure you are in the root directory of your project and run:

```sh
cerberus
```

### Installation

```
npm install @uber/fusion-plugin-tchannel
```

### Usage

```js
// main.js
import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events';
import Logger from '@uber/fusion-plugin-logtron';
import M3, {M3Token} from '@uber/fusion-plugin-m3';
import TChannel, {TChannelToken} from '@uber/fusion-plugin-tchannel';
import {LoggerToken} from 'fusion-tokens';

app.register(UniversalEventsToken, UniversalEvents);
app.register(LoggerToken, Logger);
app.register(M3Token, M3);
__NODE__ && app.register(TChannelToken, TChannel);
```

---

### API

#### Dependency registration

```js
import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events';
import Logger from '@uber/fusion-plugin-logtron';
import M3, {M3Token} from '@uber/fusion-plugin-m3';
import TChannel, {TChannelToken} from '@uber/fusion-plugin-tchannel';
import {LoggerToken} from 'fusion-tokens';

app.register(UniversalEventsToken, UniversalEvents);
app.register(M3Token, M3);
app.register(LoggerToken, Logger);
__NODE__ && app.register(TChannelToken, TChannel);
__NODE__ && app.register(TChannelClientToken, tchannelConfig);
__NODE__ && app.register(HyperbahnClientToken, hyperbahnClient);
__NODE__ && app.register(HyperbahnConfigToken, hyperbahnConfig);
```

| Name                 | Type              | Required | Description                                               |
| -------------------- | ----------------- | -------- | --------------------------------------------------------- |
| TChannelToken        | `TChannel`        | Yes      | The TChannel plugin                                       |
| M3Token              | `M3`              | Yes      | M3 plugin from `@uber/fusion-plugin-m3`                   |
| LoggerToken          | `Logger`          | Yes      | Logger plugin (typically `@uber/fusion-plugin-logtron`    |
| TChannelClientToken  | `TChannelClient`  | No       | Useful for tests. See [TChannelClient](#tchannelclient)   |
| HyperbahnClientToken | `HyperbahnClient` | No       | Useful for tests. See [HyperbahnClient](#hyperbahnclient) |
| HyperbahnConfigToken | `Object`          | No       | Configuration for Hyperbahn                               |

##### TChannelClient

```js
class TChannelClient {
  listen() {}
  close() {}
}
```

##### HyperbahnClient

```js
class Hyperbahn {
  destroy() {}
}
```
