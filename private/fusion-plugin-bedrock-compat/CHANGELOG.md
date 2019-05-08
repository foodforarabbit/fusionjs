# Changelog

## Migration to v1

Due to [https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-http-handler/pull/67](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-http-handler/pull/67), express middleware now run after koa middleware (the opposite of how they did before). Because of this, things like putState and mockHeaders no longer work.

To migrate from putState, move state initialization logic into the plugin registered to [`GetInitialStateToken`](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-react-redux#getinitialstatetoken)

To migrate from mock headers, [create a Fusion plugin](https://fusionjs.com/docs/guides/creating-a-plugin/#middlewares) that sets the appropriate `ctx.req.headers` value.