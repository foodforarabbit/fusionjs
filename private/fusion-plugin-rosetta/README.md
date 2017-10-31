# @uber/fusion-plugin-rosetta

## Overview
Rosetta plugin for fusion

## Installation

```
npm install @uber/fusion-plugin-rosetta
```

## Usage Example

```js
// src/main.js
import FusionLogger from '@uber/fusion-plugin-logger';
import FusionRosetta from '@uber/fusion-plugin-rosetta';
import MyPlugin from './myPlugin';

export default () => {
  const app = new App(<Home />);
  const Logger = app.plugin(FusionLogger);
  const Rosetta = app.plugin(FusionRosetta, __NODE__ && {
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
