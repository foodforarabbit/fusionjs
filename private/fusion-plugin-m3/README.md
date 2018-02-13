# @uber/fusion-plugin-m3

An M3 plugin for FusionJS.

This plugin is a wrapper ontop of [node-m3-client-addon](https://code.uberinternal.com/diffusion/INNODEM/).  As such, it exports a similar API with the major difference being that 'increment' does not accept a value and it defaults to 1.

---

### Installation

```sh
yarn add @uber/fusion-plugin-m3
```

---

### Example
```js
// src/main.js
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';
import M3Plugin, {M3Token, CommonTagsToken} from 'fusion-plugin-m3';

export default () => {
  const app = new App(...);
  // ...
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents); // required
  app.register(CommonTagsToken, {some: 'tags'}); // optional

  app.middleware({m3: M3Token}, ({m3}) => {
    m3.increment('increment-key', {someTag: 'here'});
    m3.timing('timing-key', new Date(), {someTag: 'here'});
    m3.gauge('gauge-key', 500, {someTag: 'here'});
    // etc
    return (ctx, next) => next();
  });
  // ...
  return app;
};
```

---

### API

#### Dependency registration

```js
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {CommonTagsToken} from 'fusion-plugin-m3';

app.register(UniversalEventsToken, UniversalEvents);
app.register(CommonTagsToken, {some: 'tags'});
```

##### Required dependencies

Name | Type | Description
-|-|-
`UniversalEventsToken` | `UniversalEvents` | An event emitter plugin to emit stats to, such as the one provided by [`fusion-plugin-universal-events`](https://github.com/fusionjs/fusion-plugin-universal-events).

##### Optional dependencies

Name | Type | Default | Description
-|-|-|-
`CommonTagsToken` | `Object` | See [defaults](https://code.uberinternal.com/diffusion/WEFUSHE/browse/master/src/server.js;223268cf27b346ef192a7c656c5d22dfdac16bf0$19) | Tags to provide to the M3 Client.

#### Service API

`.scope(tags: Object) => M3Client` - Provides a new client with additional common tags supplied.
`.close() => void` - Writes queued messages and closes the socket.
`.counter(key: string, value: number, tags?: Object) => void` - Sets count for provided tags.
`.increment(key: string, tags?: Object) => void` - Increments value for provided tags.
`.decrement(key: string, tags?: Object) => void` - Decrements value for provided tags.
`.timing(key: string, duration: number, tags?: Object) => void` - Time something, in milliseconds.
`.gauge(key: string, value: number, tags?: Object) => void` - Take a gauge reading of something.
`.immediateCounter(key: string, value: number, tags?: Object) => void` - Similar to counter, but with an immediate flush.
`.immediateIncrement(key: string, tags?: Object) => void` - Similar to increment, but with an immediate flush.
`.immediateDecrement(key: string, tags?: Object) => void` - Similar to decrement, but with an immediate flush.
`.immediateTiming(key: string, value: number, tags?: Object) => void` - Similar with timing, but with an immediate flush.
`.immediateGauge(key: string, value: number, tags?: Object) => void` - Similar to gauge, but with an immediate flush.


