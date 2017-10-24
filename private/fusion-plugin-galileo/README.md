# graphene-galileo

galileo client plugin for granphene

## Installation

```
npm install @uber/graphene-galileo
```

## Graphene

## Usage

```js
// ...
import GalileoPlugin from  '@uber/graphene-galileo';
import galileoConfig from  'config/galileo';
// ...

const Galileo = app.plugin(GalileoPlugin, {
  Logger, // UniversalLogger plugin instance
  Tracer, // Jeager plugin instance
  config: galileoConfig
});

// Access galileo client
Galileo.of().galileo;

// Cleanup Galileo
Galileo.destroy()
```

## Config

Config should be added to app/src/config/galileo.js to the scaffolded application

```
export default {
    appName: '<if you want to overwrite>',
    galileo: {
      /* custom config if any*/
    }
}
```
