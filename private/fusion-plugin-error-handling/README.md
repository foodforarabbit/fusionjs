# @uber/fusion-plugin-error-handling

This is a fusion plugin for uber specific error handling.

### Example
```js
app.plugin(ErrorHandlingPlugin, {
  Logger, // required
  M3, // required
  CsrfProtection: {
    ignore, // required
  },
  logTimeout: 10000, // optional
  m3Timeout: 10000, // optional
});
```
