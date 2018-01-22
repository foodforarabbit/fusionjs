# @uber/fusion-plugin-m3

M3 plugin for fusion

## Overview

This plugin exports a very similar interface to [node-m3-client-addon](https://code.uberinternal.com/diffusion/INNODEM/), the major difference is increment doesnt accept a value, it defaults to 1.


## Installation

```
npm install @uber/fusion-plugin-m3
```

## Usage
```js
// main.js
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events;'
import M3Plugin, {M3Token, CommonTagsToken} from 'fusion-plugin-m3';

app.register(UniversalEventsToken, UniversalEvents); // required
app.register(CommonTagsToken, {some: 'tags'}); // optional
app.register(M3Token, M3Plugin);

app.middleware({m3: M3Token}, ({m3}) => {
  m3.increment('increment-key', {someTag: 'here'});
  m3.timing('timing-key', new Date(), {someTag: 'here'});
  m3.gauge('gauge-key', 500, {someTag: 'here'});
  // etc
  return (ctx, next) => next();
});
```