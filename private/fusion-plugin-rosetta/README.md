# @uber/graphene-rosetta

## Overview
Rosetta client for Graphene

## Installation

```
npm install @uber/graphene-rosetta
```

## Usage Example

```js
// src/main.js
import GrapheneLogger from '@uber/graphene-logger';
import GrapheneRosetta from '@uber/graphene-rosetta';
import MyPlugin from './myPlugin';

export default () => {
  const app = new App(<Home />);
  const Logger = app.plugin(GrapheneLogger);
  const Rosetta = app.plugin(GrapheneRosetta, __NODE__ && {
    Logger, // required
    service: 'service-name', // required
    dir: '../translations/', // optional
    cwd: '/some/path', // optional
    reloadInterval: 1000 * 60 * 60 // optional
  });
  app.plugin(MyPlugin, {Rosetta});
  return app;
}

// myPlugin.js
export default const MyPlugin = ({Rosetta}) => {
  const rosetta = Rosetta.of();
  return function myMiddleware(ctx, next) => {
    const locales = rosetta.locales;
    const translations = rosetta.translations;
    return next();
  }
  // ...
  // in tests, you need to call cleanup to clear the load interval
  // ...
  Rosetta.of().clearInterval();
}
```
