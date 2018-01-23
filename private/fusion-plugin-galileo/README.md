# fusion-plugin-galileo

galileo client plugin for fusion 

## Installation

```
npm install @uber/fusion-plugin-galileo
```

## fusion

## Usage

```js
// ...
import GalileoPlugin, {GalileoToken, GalileoConfigToken} from  '@uber/fusion-plugin-galileo';

app.register(GalileoToken, GalileoPlugin);
app.register(GalileoConfigToken, {
  // optional galileo config
  // see https://code.uberinternal.com/diffusion/ENGALWP/
});

app.middleware({Galileo: GalileoToken}, ({Galileo}) => {
  // Access galileo client
  Galileo.galileo;
  // Cleanup Galileo
  Galileo.destroy()
  return (ctx, next) => next(); 
});

```
