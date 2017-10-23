# @uber/events-adapter

An adapter for uber specific events.

## Overview


## Installation

```
npm install @uber/events-adapter
```

## Usage
```js// main.js
import EventsAdapterPlugin from '@uber/events-adapter';
const UniversalEvents = app.plugin(UniversalEvents, {fetch});
__NODE__ && app.plugin(EventsAdapterPlugin, {UniversalEvents});
```