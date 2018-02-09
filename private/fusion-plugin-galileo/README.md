# @uber/fusion-plugin-galileo

Galileo client plugin for FusionJS apps.

---

### Installation

```
yarn add @uber/fusion-plugin-galileo
```

---

### Example

```js
// main.js
import GalileoPlugin, {GalileoToken, GalileoConfigToken} from  '@uber/fusion-plugin-galileo';

app.register(GalileoToken, GalileoPlugin);
app.register(GalileoConfigToken, {
  // optional galileo config
  // see https://code.uberinternal.com/diffusion/ENGALWP/
});
// ...

app.middleware({Galileo: GalileoToken}, ({Galileo}) => {
  // Access galileo client
  Galileo.galileo;
  // Cleanup Galileo
  Galileo.destroy()
  return (ctx, next) => next();
});
```

---

### API

#### Dependency registration

```js
import {GalileoConfigToken} from  '@uber/fusion-plugin-galileo';
import {LoggerToken} from 'fusion-tokens';
import M3Plugin, {M3Token} from '@uber/fusion-plugin-m3';
import TracerPlugin, {TracerToken} from '@uber/fusion-plugin-tracer';

app.register(GalileoConfigToken, /*some config*/);
app.register(LoggerToken, /*some Logger*/);
app.register(M3Token, M3Plugin);
app.register(TracerToken, TracerPlugin);
```

##### Required dependencies

Name | Type | Description
-|-|-
`LoggerToken` | `Logger` | A [type-compliant logger](https://github.com/fusionjs/fusion-tokens/blob/master/src/index.js#L23-L32). Using [Logtron](https://code.uberinternal.com/diffusion/WEFUSTX/) is recommended for most cases at Uber.
`M3Token` | `M3Plugin` | An M3 plugin for FusionJS.  Using [@uber/fusion-plugin-m3](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-m3) is recommended for most cases at Uber.
`TracerToken` | `TracerPlugin` | A Tracer plugin for FusionJS.  Using [@uber/fusion-plugin-tracer](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-tracer) is recommended for most cases at Uber.

##### Optional dependencies

Name | Type | Default | Description
-|-|-|-
`GalileoConfigToken` | `GalileoConfig` | See below | Configuration object for the Galileo client.

#### Instance API

See [web/unpm-galileo](https://code.uberinternal.com/diffusion/WEUNPGJ/) for more information.

---

### Configuration

If no configuration is provided, the default is:

```js
{
  enabled: true,
  allowedEntities: ['EVERYONE'],
  enforcePercentage: 0.0,
  wonkamasterUrl: __DEV__ && 'https://wonkabar.uberinternal.com'
}
```

See [engsec/galileo-node](https://code.uberinternal.com/diffusion/ENGALWP/) for more information.
