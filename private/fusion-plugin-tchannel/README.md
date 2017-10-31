# TChannel plugin for fusion

This is a fusion plugin for Tchannel and hyperbahn.

### Installation

```
npm install @uber/fusion-plugin-tchannel
```

### Usage

```js
// main.js
import UniversalEventsPlugin from 'fusion-plugin-universal-events';
import LoggerPlugin from '@uber/fusion-plugin-logtron';
import M3Plugin from '@uber/fusion-plugin-m3';
import TChannelPlugin from '@uber/fusion-plugin-tchannel';

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
