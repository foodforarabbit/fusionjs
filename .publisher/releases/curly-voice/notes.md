## fusion-cli
> *Changes since v2.14.0*

 - Support React Profiler devtool in production (#1135)
 - Replace iltorb with zlib brotli (#1145)

## @uber/fusion-plugin-marketing
> *Changes since v2.2.4*

 - Fix fusion-plugin-marketing response for `_track` endpoint - need to await response (#1109)
 - Pull marketing cookie ID from marketing plugin as opposed to request headers (#1147)

## @uber/fusion-plugin-feature-toggles
> *Changes since v3.1.6*

 - Pull marketing cookie ID from marketing plugin as opposed to request headers (#1147)

## fusion-plugin-rpc
> *Changes since v3.5.3*

 - Add options param to request in fusion-plugin-rpc (#1124)

## fusion-plugin-react-redux
> *Changes since v2.1.4*

 - Handle 'undefined' server-side redux state (#1129)

## fusion-plugin-i18n
> *Changes since v2.4.4*

 - Don't throw exception from failed i18n loading (#1143)

## @uber/create-uber-web
> *Changes since v5.2.0*

 - Remove `LogtronTeamToken` registration via codemod (#1133)
 - Add logtron codemod upgrade step (#1134)
 - Stop upgrading koa libdef (#1141)

## @uber/fusion-plugin-logtron
> *Changes since v3.2.0*

 - Add some colors for log messages in development (#937)
 - Refactor logger to clone errors before logging (WPT-6272) (#1127)

## @uber/fusion-plugin-m3
> *Changes since v2.1.4*

 - Fix types for M3 plugin (#945)

## fusion-plugin-node-performance-emitter
> *Changes since v2.1.4*

 - Upgrade gc-stats dep (#1144)

## @uber/fusion-plugin-feature-toggles-react
> *Changes since v3.1.6*

 - Make fusion-plugin-atreyu peer of fusion-plugin-feature-toggles-react (#1130)
 - Update README.md to use newer synchronous .get API (#1136)

## jazelle
> *Changes since v0.0.0-alpha.19*

 - Do not list projects' node_modules in bazelignore (#1106)
 - Upgrade bazel version to 3.4.0 (#1107)
 - Call binary from global jazelle bin folder (#1111)
 - Upgrade packaged yarn to 1.19.1 (#1116)
 - Upgrade bazel to 3.4.1 (#1120)
 - Avoid using 'resolutions' versions when syncing (#1125)
 - Support version aliases (e.g. npm:foo@1) in `jazelle align` (#1126)
 - Add precommand hook (#1131)
 - Update jazelle cli to allow subprocesses to access original cwd (#1137)
 - Update jazelle changes script to handle file names with special characters (#1138)
 - Remove process event listener when exec completes (#1140)

 
 <details>
  <summary>Packages unchanged aside from dependency upgrades</summary>

 ## @uber/fusion-analyticsjs-utils
 ## @uber/fusion-dev-cli
 ## @uber/fusion-legacy-styling-compat-mixin
 ## @uber/fusion-metrics
 ## @uber/fusion-migrate
 ## @uber/fusion-plugin-analytics-session
 ## @uber/fusion-plugin-atreyu
 ## @uber/fusion-plugin-auth-headers
 ## @uber/fusion-plugin-bedrock-compat
 ## @uber/fusion-plugin-error-handling
 ## @uber/fusion-plugin-events-adapter
 ## @uber/fusion-plugin-flipr
 ## @uber/fusion-plugin-galileo
 ## @uber/fusion-plugin-google-analytics
 ## @uber/fusion-plugin-graphql-logging-middleware
 ## @uber/fusion-plugin-graphql-metrics
 ## @uber/fusion-plugin-heatpipe
 ## @uber/fusion-plugin-initial-state-compat
 ## @uber/fusion-plugin-logger
 ## @uber/fusion-plugin-magellan
 ## @uber/fusion-plugin-page-skeleton-compat
 ## @uber/fusion-plugin-proxy-compat
 ## @uber/fusion-plugin-rosetta
 ## @uber/fusion-plugin-s3-asset-proxying
 ## @uber/fusion-plugin-secrets
 ## @uber/fusion-plugin-secure-headers
 ## @uber/fusion-plugin-tchannel
 ## @uber/fusion-plugin-tealium
 ## @uber/fusion-plugin-tracer
 ## @uber/fusion-plugin-uber-xhr-compat
 ## @uber/fusion-plugin-universal-logger-compat
 ## @uber/fusion-plugin-universal-m3-compat
 ## @uber/fusion-plugin-web-rpc-compat
 ## create-fusion-app
 ## create-fusion-plugin
 ## eslint-config-fusion
 ## fusion-core
 ## fusion-plugin-apollo
 ## fusion-plugin-browser-performance-emitter
 ## fusion-plugin-connected-react-router
 ## fusion-plugin-csrf-protection
 ## fusion-plugin-error-handling
 ## fusion-plugin-font-loader-react
 ## fusion-plugin-http-handler
 ## fusion-plugin-i18n-react
 ## fusion-plugin-introspect
 ## fusion-plugin-jwt
 ## fusion-plugin-react-helmet-async
 ## fusion-plugin-react-router
 ## fusion-plugin-redux-action-emitter-enhancer
 ## fusion-plugin-rpc-redux-react
 ## fusion-plugin-styletron-react
 ## fusion-plugin-service-worker
 ## fusion-plugin-universal-events
 ## fusion-plugin-universal-logger
 ## fusion-plugin-web-app-manifest
 ## fusion-react
 ## fusion-rpc-redux
 ## fusion-scaffolder
 ## fusion-test-utils
 ## fusion-tokens


 </details>
