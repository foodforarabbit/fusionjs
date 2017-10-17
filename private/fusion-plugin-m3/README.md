# @uber/graphene-m3

M3 client for Graphene

## Overview

This plugin exports a very similar interface to [node-m3-client-addon](https://code.uberinternal.com/diffusion/INNODEM/), the major difference is increment doesnt accept a value, it defaults to 1.


## Installation

```
npm install @uber/graphene-m3
```

## Usage
```js
// main.js
import m3Config from 'config/m3';

const UniversalEvents = app.plugin(UniversalEvents, {fetch});
const M3Service = app.plugin(M3Plugin, {UniversalEvents, m3Config});

// increments on server
if (__NODE__) {
  M3Service.of().increment('server.stats.awesomeness', {route: 'happy'});
}

// increments on browser
if (__BROWSER__) {
  M3Service.of().increment('mysterious_button.click', {color: 'rainbow'});
}
```

## Config
// TODO: Finalize the statement below
```
Note: The config should be produced by app/src/config/m3.js which is scaffolded with your application.
```

```js
commonTags: {
  dc: 'sjc1', // Data center name
  env: 'production', // Environmental value
  deployment: 'production', // uDeploy deployment group
  service: 'awesome-frontend' // Service name
}
```