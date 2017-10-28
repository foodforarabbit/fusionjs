# TChannel plugin for Graphene

This is a Graphene plugin for Tchannel and hyperbahn.

### Installation

```
npm install @uber/graphene-tchannel
```

### Usage

```js
// main.js
import UniversalEventsPlugin from '@uber/graphene-universal-events';
import LoggerPlugin from '@uber/graphene-logtron';
import M3Plugin from '@uber/graphene-m3';
import TChannelPlugin from '@uber/graphene-tchannel';

const UniversalEvents = app.plugin(UniversalEventsPlugin, {fetch});
const M3 = app.plugin(M3Plugin, {UniversalEvents});
const Logger = app.plugin(LoggerPlugin, {M3});
const TChannelPlugin = app.plugin(TChannelPlugin, {
  M3,
  Logger,
  appName: '',
  config: {
    hyperbahn: {} // config passed to hyperbahn
  },
});
if (__NODE__) {
  const {tchannel, hyperbahn} = TChannelPlugin.of();
  // latter on, clean up the plugins
  TChannelPlugin.of().cleanup();
}
```
