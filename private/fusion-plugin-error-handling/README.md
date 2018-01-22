# @uber/fusion-plugin-error-handling

This is a fusion plugin for uber specific error handling.

### Example
```js
import {LoggerToken} from 'fusion-tokens';
import LoggerPlugin from '@uber/fusion-plugin-logtron';
import M3Plugin {M3Token} from '@uber/fusion-plugin-m3';
import UberErrorHandling from 'fusion-plugin-uber-error-handling';
import ErrorHandling, {ErrorHandlerToken} from 'fusion-plugin-error-handling';
// register dependencies
app.register(ErrorHandling);
app.register(LoggerToken, LoggerPlugin);
app.register(M3Token, M3Plugin);
// register handler
app.register(ErrorHandlerToken, UberErrorHandling);
```
