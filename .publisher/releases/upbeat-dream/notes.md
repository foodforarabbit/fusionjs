## @uber/create-uber-web
> *Changes since v3.2.2*

 - Enable global create-uber-web canary version ([#366](https://github.com/uber/fusionjs/pull/366))
 - Modify package.json template for web monorepo projects ([#378](https://github.com/uber/fusionjs/pull/378))
 - Remove conduit token when provisioning ([#380](https://github.com/uber/fusionjs/pull/380))
 - Overwrite invalid semantic versions in `package.json` ([#388](https://github.com/uber/fusionjs/pull/388))
 - Update dubstep and babel flow types ([#389](https://github.com/uber/fusionjs/pull/389))
 - Allow provisioning from a project directory inside of the web monorepo ([#393](https://github.com/uber/fusionjs/pull/393))
 - Update rpc-redux-react ([#399](https://github.com/uber/fusionjs/pull/399))
 - Fix codemod that removed react packages ([#407](https://github.com/uber/fusionjs/pull/407))

## @uber/fusion-plugin-rosetta
> *Changes since v2.1.2*

 - Enable user use snapshot in DEV ([#368](https://github.com/uber/fusionjs/pull/368))
- Add localeCode search parameter to resolve caching issues with translations ([#359](https://github.com/uber/fusionjs/pull/359))

## fusion-cli
> *Changes since v2.2.1*

 - Fix experimentalSideEffectsTest by pruning unused imports ([#337](https://github.com/uber/fusionjs/pull/337))
 - Add .fusionrc option to enable/disable zopfli and brotli ([#394](https://github.com/uber/fusionjs/pull/394))
 - Fix bug with handling web socket request failures in dev ([#371](https://github.com/uber/fusionjs/pull/371))
 - Move babel loader into a worker farm to improve compile speeds ([#396](https://github.com/uber/fusionjs/pull/396))

## fusion-core
> *Changes since v2.0.3*

 - Fix typing of optional property in Token ([#369](https://github.com/uber/fusionjs/pull/369))

## fusion-plugin-i18n
> *Changes since v2.2.2*

 - Emit `i18n-translate-miss` event when translation is missing ([#361](https://github.com/uber/fusionjs/pull/361))
 - Add peer deps to dev deps for fusion-plugin-i18n and fusion-plugin-rpc ([#395](https://github.com/uber/fusionjs/pull/395))

## fusion-plugin-react-helmet-async
> *Changes since v2.0.5*

 - Use dangerouslySetHTML for setting the title in the helmet plugin ([#386](https://github.com/uber/fusionjs/pull/386))

## fusion-plugin-react-router
> *Changes since v2.0.5*

 - Fix deprecation warning for `history/createBrowserHistory` import ([#353](https://github.com/uber/fusionjs/pull/353))

## fusion-plugin-rpc
> *Changes since v3.1.2*

 - Add peer deps to dev deps for fusion-plugin-i18n and fusion-plugin-rpc ([#395](https://github.com/uber/fusionjs/pull/395))
 - Make i18n optional to RPC ([#402](https://github.com/uber/fusionjs/pull/402))

<details>
<summary>Dependency upgrades</summary>

## Packages with updated dependencies

 * @uber/fusion-metrics
 * @uber/fusion-plugin-auth-headers
 * @uber/fusion-plugin-bedrock-compat
 * @uber/fusion-plugin-error-handling
 * @uber/fusion-plugin-feature-toggles
 * @uber/fusion-plugin-feature-toggles-react
 * @uber/fusion-plugin-google-analytics
 * @uber/fusion-plugin-google-analytics-react
 * @uber/fusion-plugin-graphql-logging-middleware
 * @uber/fusion-plugin-graphql-metrics
 * @uber/fusion-plugin-heatpipe
 * @uber/fusion-plugin-initial-state-compat
 * @uber/fusion-plugin-logtron-react
 * @uber/fusion-plugin-m3
 * @uber/fusion-plugin-m3-react
 * @uber/fusion-plugin-magellan
 * @uber/fusion-plugin-page-skeleton-compat
 * @uber/fusion-plugin-proxy-compat
 * @uber/fusion-plugin-secrets
 * @uber/fusion-plugin-secure-headers
 * @uber/fusion-plugin-tchannel
 * @uber/fusion-plugin-tealium-react
 * @uber/fusion-plugin-tracer
 * @uber/fusion-plugin-universal-logger-compat
 * @uber/fusion-plugin-universal-m3-compat
 * fusion-plugin-apollo
 * fusion-plugin-browser-performance-emitter
 * fusion-plugin-connected-react-router
 * fusion-plugin-error-handling
 * fusion-plugin-http-handler
 * fusion-plugin-i18n-react
 * fusion-plugin-jwt
 * fusion-plugin-node-performance-emitter
 * fusion-plugin-rpc-redux-react
 * fusion-plugin-service-worker
 * fusion-plugin-styletron-react
 * fusion-plugin-universal-events
 * fusion-plugin-universal-events-react
 * fusion-plugin-universal-logger
 * fusion-plugin-web-app-manifest
 * fusion-tokens
</details>
