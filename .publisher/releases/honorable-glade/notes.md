## @uber/fusion-plugin-events-adapter
> *Changes since v3.3.6*

 - Enable middleware timing ([RFC](https://github.com/fusionjs/fusionjs/blob/master/rfcs/text/0000-middleware-timing.md)) (#1224)
 - Add heatpipe lossless publish support (#1242)

## @uber/fusion-plugin-feature-toggles
> *Changes since v3.1.11*

 - Pass session id header through (#1227)

## @uber/fusion-plugin-flipr
> *Changes since v2.2.6*

 - Fix flipr bootstrap script for yarn v2 (#1230)

## @uber/fusion-plugin-galileo
> *Changes since v2.1.9*

 - Upgrade galileo (#1236)
   
   Note: This adds support for Node.js 14, dropping support for Node.js 10.

## @uber/fusion-plugin-heatpipe
> *Changes since v3.1.10*

 - Add lossless publish support (#1242)

## @uber/fusion-plugin-rosetta
> *Changes since v3.0.6*

 - Add opt-in performance enhancements ([Details](https://github.com/uber/fusionjs/blob/5dbda4b03fa57bc5bac90ce57988874fc5344750/private/fusion-plugin-rosetta/README.md#as-a-loader-for-fusion-plugin-i18n)) (#1231)
 - Improve documentation on Locale type (#1234)

## @uber/fusion-plugin-web-analytics
 - Add web-analytics plugin (#1240)

## fusion-cli
> *Changes since v2.16.2*

 - Check stored value of DANGEROUSLY_EXPOSE_SOURCE_MAPS (#1233)
 - Webpack 5 upgrade with [persistent build cache](https://github.com/fusionjs/fusionjs/blob/master/fusion-cli/docs/fusionrc.md#disablebuildcache) (#1213)

## fusion-core
> *Changes since v2.2.6*

 - Enable middleware timing ([RFC](https://github.com/fusionjs/fusionjs/blob/master/rfcs/text/0000-middleware-timing.md)) (#1224)

## fusion-plugin-i18n
> *Changes since v2.4.9*

 - Add opt-in performance enhancements ([Details](https://github.com/uber/fusionjs/blob/5dbda4b03fa57bc5bac90ce57988874fc5344750/private/fusion-plugin-rosetta/README.md#as-a-loader-for-fusion-plugin-i18n)) (#1231)
 - Improve documentation on Locale type (#1234)

## fusion-plugin-i18n-react
> *Changes since v3.1.10*

 - Add opt-in performance enhancements ([Details](https://github.com/uber/fusionjs/blob/5dbda4b03fa57bc5bac90ce57988874fc5344750/private/fusion-plugin-rosetta/README.md#as-a-loader-for-fusion-plugin-i18n)) (#1231)
 - Improve documentation on Locale type (#1234)

## fusion-plugin-introspect
> *Changes since v1.1.7*

 - Add route_prefix to diagnostics request (#1237)
 - Remove lockfile from introspect metadata (#1239)

### Other packages

Note: In addition to the above packages, these packages have been given a patch version bump as result of change in peer-dependencies

<details>
 
 <summary>Packages published with patch bumps</summary>

## @uber/create-uber-web
> *Changes since v5.3.5*

 - Upgraded fusion-core dependency
 - Upgraded @uber/fusion-plugin-graphql-metrics dependency
 - Upgraded @uber/fusion-plugin-marketing dependency
 - Upgraded @uber/fusion-metrics dependency
 - Upgraded @uber/fusion-plugin-analytics-session dependency
 - Upgraded @uber/fusion-plugin-atreyu dependency
 - Upgraded @uber/fusion-plugin-auth-headers dependency
 - Upgraded @uber/fusion-plugin-error-handling dependency
 - Upgraded @uber/fusion-plugin-events-adapter dependency
 - Upgraded @uber/fusion-plugin-feature-toggles-react dependency
 - Upgraded @uber/fusion-plugin-flipr dependency
 - Upgraded @uber/fusion-plugin-galileo dependency
 - Upgraded @uber/fusion-plugin-heatpipe dependency
 - Upgraded @uber/fusion-plugin-logtron dependency
 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded @uber/fusion-plugin-rosetta dependency
 - Upgraded @uber/fusion-plugin-s3-asset-proxying dependency
 - Upgraded @uber/fusion-plugin-secrets dependency
 - Upgraded @uber/fusion-plugin-secure-headers dependency
 - Upgraded @uber/fusion-plugin-tchannel dependency
 - Upgraded @uber/fusion-plugin-tracer dependency
 - Upgraded @uber/fusion-plugin-web-analytics dependency
 - Upgraded fusion-cli dependency
 - Upgraded fusion-plugin-browser-performance-emitter dependency
 - Upgraded fusion-plugin-csrf-protection dependency
 - Upgraded fusion-plugin-error-handling dependency
 - Upgraded fusion-plugin-font-loader-react dependency
 - Upgraded fusion-plugin-i18n-react dependency
 - Upgraded fusion-plugin-introspect dependency
 - Upgraded fusion-plugin-jwt dependency
 - Upgraded fusion-plugin-node-performance-emitter dependency
 - Upgraded fusion-plugin-react-helmet-async dependency
 - Upgraded fusion-plugin-react-redux dependency
 - Upgraded fusion-plugin-react-router dependency
 - Upgraded fusion-plugin-redux-action-emitter-enhancer dependency
 - Upgraded fusion-plugin-rpc dependency
 - Upgraded fusion-plugin-styletron-react dependency
 - Upgraded fusion-plugin-universal-events dependency
 - Upgraded fusion-react dependency
 - Upgraded fusion-tokens dependency
 - Upgraded fusion-plugin-apollo dependency

## @uber/fusion-metrics
> *Changes since v1.1.7*

 - Upgraded fusion-plugin-introspect dependency

## @uber/fusion-plugin-analytics-session
> *Changes since v2.1.7*

 - Upgraded fusion-core dependency

## @uber/fusion-plugin-atreyu
> *Changes since v2.1.9*

 - Upgraded @uber/fusion-plugin-galileo dependency
 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded @uber/fusion-plugin-tchannel dependency
 - Upgraded @uber/fusion-plugin-tracer dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-auth-headers
> *Changes since v4.0.5*

 - Upgraded fusion-core dependency

## @uber/fusion-plugin-bedrock-compat
> *Changes since v2.1.9*

 - Upgraded @uber/fusion-plugin-atreyu dependency
 - Upgraded @uber/fusion-plugin-flipr dependency
 - Upgraded @uber/fusion-plugin-galileo dependency
 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-error-handling
> *Changes since v2.3.7*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-feature-toggles-react
> *Changes since v3.1.11*

 - Upgraded @uber/fusion-plugin-feature-toggles dependency
 - Upgraded @uber/fusion-plugin-atreyu dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-react dependency

## @uber/fusion-plugin-google-analytics
> *Changes since v2.1.8*

 - Upgraded fusion-core dependency

## @uber/fusion-plugin-graphql-logging-middleware
> *Changes since v1.2.2*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded @uber/fusion-plugin-tracer dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-apollo dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-graphql-metrics
> *Changes since v1.2.10*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded @uber/fusion-plugin-tracer dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-apollo dependency
 - Upgraded fusion-plugin-universal-events dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-initial-state-compat
> *Changes since v1.1.7*

 - Upgraded fusion-core dependency

## @uber/fusion-plugin-logger
> *Changes since v0.3.2*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-logtron
> *Changes since v3.3.2*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-m3
> *Changes since v2.2.2*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency

## @uber/fusion-plugin-magellan
> *Changes since v2.1.7*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-marketing
> *Changes since v2.2.9*

 - Upgraded @uber/fusion-plugin-analytics-session dependency
 - Upgraded @uber/fusion-plugin-heatpipe dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-page-skeleton-compat
> *Changes since v1.1.7*

 - Upgraded fusion-core dependency

## @uber/fusion-plugin-proxy-compat
> *Changes since v1.1.10*

 - Upgraded @uber/fusion-plugin-galileo dependency
 - Upgraded @uber/fusion-plugin-tracer dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-s3-asset-proxying
> *Changes since v2.2.7*

 - Upgraded fusion-core dependency

## @uber/fusion-plugin-secrets
> *Changes since v2.1.7*

 - Upgraded fusion-core dependency

## @uber/fusion-plugin-secure-headers
> *Changes since v5.1.7*

 - Upgraded fusion-core dependency

## @uber/fusion-plugin-tchannel
> *Changes since v2.1.9*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-tealium
> *Changes since v2.1.8*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-tracer
> *Changes since v2.1.7*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-uber-xhr-compat
> *Changes since v1.1.7*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-universal-logger-compat
> *Changes since v1.1.7*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## @uber/fusion-plugin-universal-m3-compat
> *Changes since v1.2.2*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency

## @uber/fusion-plugin-web-rpc-compat
> *Changes since v1.1.9*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-rpc dependency

## fusion-plugin-apollo
> *Changes since v3.4.9*

 - Upgraded fusion-core dependency
 - Upgraded fusion-react dependency
 - Upgraded fusion-tokens dependency

## fusion-plugin-browser-performance-emitter
> *Changes since v2.2.9*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency

## fusion-plugin-connected-react-router
> *Changes since v2.1.12*

 - Upgraded fusion-plugin-react-redux dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-react-router dependency

## fusion-plugin-csrf-protection
> *Changes since v3.1.8*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## fusion-plugin-error-handling
> *Changes since v2.2.7*

 - Upgraded fusion-core dependency

## fusion-plugin-font-loader-react
> *Changes since v2.1.9*

 - Upgraded fusion-core dependency
 - Upgraded fusion-react dependency

## fusion-plugin-http-handler
> *Changes since v1.1.7*

 - Upgraded fusion-core dependency

## fusion-plugin-jwt
> *Changes since v2.1.7*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## fusion-plugin-node-performance-emitter
> *Changes since v2.1.9*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency

## fusion-plugin-react-helmet-async
> *Changes since v2.2.8*

 - Upgraded fusion-core dependency

## fusion-plugin-react-redux
> *Changes since v2.2.4*

 - Upgraded fusion-core dependency

## fusion-plugin-react-router
> *Changes since v2.2.12*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency

## fusion-plugin-redux-action-emitter-enhancer
> *Changes since v3.1.9*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency

## fusion-plugin-rpc
> *Changes since v3.7.1*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-i18n dependency
 - Upgraded fusion-plugin-universal-events dependency
 - Upgraded fusion-tokens dependency

## fusion-plugin-rpc-redux-react
> *Changes since v4.3.9*

 - Upgraded fusion-plugin-react-redux dependency
 - Upgraded fusion-plugin-rpc dependency
 - Upgraded fusion-react dependency

## fusion-plugin-service-worker
> *Changes since v3.1.13*

 - Upgraded fusion-cli dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## fusion-plugin-styletron-react
> *Changes since v3.2.5*

 - Upgraded fusion-core dependency

## fusion-plugin-universal-events
> *Changes since v2.1.9*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## fusion-plugin-universal-logger
> *Changes since v2.1.7*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## fusion-plugin-web-app-manifest
> *Changes since v1.1.7*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

## fusion-react
> *Changes since v4.0.8*

 - Upgraded fusion-tokens dependency
 - Upgraded fusion-core dependency

## fusion-test-utils
> *Changes since v2.1.7*

 - Upgraded fusion-core dependency

## fusion-tokens
> *Changes since v2.1.7*

 - Upgraded fusion-core dependency

</details>
