## Changes affecting multiple packages
Replace modified Flow libdefs with official `flow-typed` definitions ([#438](https://github.com/uber/fusionjs/pull/438)) 
 - fusion-core
 - fusion-plugin-i18n
 - fusion-plugin-react-redux
 - fusion-plugin-redux-action-emitter-enhancer
 - fusion-plugin-rpc-redux-react
 - fusion-rpc-redux

## @uber/create-uber-web
> *Changes since v3.3.0*

Highlights
 - The GraphQL scaffold is now listed as recommended, and has moved out of the beta phase
 - The GraphQL scaffold now supports react testing library and @apollo scoped packages, including hooks
 - The GraphQL scaffold now supports introspection fragment matching and query validation via linter integration
 - Codemods are shipped for all GraphQL scaffold changes

 - Add font library ([#424](https://github.com/uber/fusionjs/pull/424))
 - Add font library codemod ([#425](https://github.com/uber/fusionjs/pull/425))
 - Install official libdefs in scaffolds ([#444](https://github.com/uber/fusionjs/pull/444))
 - Add unmet peer dep, regen lock file ([#445](https://github.com/uber/fusionjs/pull/445))
 - Add flowconfig codemod helpers ([#451](https://github.com/uber/fusionjs/pull/451))
 - Upgrade to latest apollo packages ([#426](https://github.com/uber/fusionjs/pull/426))
 - Add eslint-plugin-graphql to graphql scaffold ([#382](https://github.com/uber/fusionjs/pull/382))
 - Update GraphQL Scaffold ([#462](https://github.com/uber/fusionjs/pull/462))
 - Add upgrade utility to run flow-typed ([#463](https://github.com/uber/fusionjs/pull/463))
 - Upgrade @uber/standard-fonts to 0.1.2 in scaffold templates ([#467](https://github.com/uber/fusionjs/pull/467))
 - Fix eslint codemod ([#468](https://github.com/uber/fusionjs/pull/468))
 - Fix flowconfig codemod ([#471](https://github.com/uber/fusionjs/pull/471))
 - Update codemod to support users already importing hook APIs ([#475](https://github.com/uber/fusionjs/pull/475))
 - Fix package import codemod ([#476](https://github.com/uber/fusionjs/pull/476))
 - Fix stripped type keyword from import ([#477](https://github.com/uber/fusionjs/pull/477))
 - Apply flow codemods ([#480](https://github.com/uber/fusionjs/pull/480))
 - Fix website-graphql scaffold (was failing lint) ([#488](https://github.com/uber/fusionjs/pull/488))
 - Update Graphql Scaffold ([#486](https://github.com/uber/fusionjs/pull/486))
 - Update graphql scaffold to be recommended ([#487](https://github.com/uber/fusionjs/pull/487))

## @uber/fusion-plugin-feature-toggles
> *Changes since v3.0.6*

 - Convert multiple query params to string before GetTreatmentGroupByNames ([#406](https://github.com/uber/fusionjs/pull/406))

## @uber/fusion-plugin-s3-asset-proxying
> *Changes since v2.0.5*

 - Fix typo and clarify usage of the CLI tool ([#430](https://github.com/uber/fusionjs/pull/430))

## eslint-config-fusion
> *Changes since v6.0.2*

 - Add relaxed peerDep version ([#446](https://github.com/uber/fusionjs/pull/446))

## fusion-cli
> *Changes since v2.3.0*

 - Added support for configuration of bundle chunking logic via [`splitChunks`](https://webpack.js.org/plugins/split-chunks-plugin/) in `fusionrc.js` ([#454](https://github.com/uber/fusionjs/pull/454))
 - Update setup file to support `@testing-library/react` ([#461](https://github.com/uber/fusionjs/pull/461))

## fusion-plugin-apollo
> *Changes since v2.0.4*

 - Fix flow types for apollo cache and apollo client ([#419](https://github.com/uber/fusionjs/pull/419))
 - Upgrade to latest apollo packages ([#426](https://github.com/uber/fusionjs/pull/426))
 - Fix issue with executor and custom apollo context ([#474](https://github.com/uber/fusionjs/pull/474))

## fusion-plugin-font-loader-react
> *Changes since v2.0.4*

 - Move fusion-react into dev/peerDeps for fusion-plugin-font-loader-react ([#458](https://github.com/uber/fusionjs/pull/458))
 - Fix styled font faces [fusion-plugin-font-loader-react]  ([#482](https://github.com/uber/fusionjs/pull/482))

## fusion-plugin-i18n-react
> *Changes since v3.0.3*

 - Fix broken link in fusion-plugin-react-redux README ([#439](https://github.com/uber/fusionjs/pull/439))
 - Fix translate hook example ([#421](https://github.com/uber/fusionjs/pull/421))

## fusion-plugin-jwt
> *Changes since v2.0.4*

 - Fix mistake in SessionCookieExpiresToken documentation ([#473](https://github.com/uber/fusionjs/pull/473))

## fusion-plugin-react-redux
> *Changes since v2.0.4*

 - Fix broken link in fusion-plugin-react-redux README ([#439](https://github.com/uber/fusionjs/pull/439))

## fusion-plugin-react-router
> *Changes since v2.0.6*

 - Remove browserHistory preservation logic across jsdom browser tests ([#450](https://github.com/uber/fusionjs/pull/450))
 - Upgrade react-router-dom to v5 ([#465](https://github.com/uber/fusionjs/pull/465))

## fusion-plugin-rpc
> *Changes since v3.2.0*

 - Update rpc mock to have optional dependency on UniversalEvents ([#485](https://github.com/uber/fusionjs/pull/485))

## fusion-plugin-universal-events
> *Changes since v2.0.5*

 - Fix broken link in fusion-plugin-react-redux README ([#439](https://github.com/uber/fusionjs/pull/439))

## fusion-react
> *Changes since v3.1.3*

 - Upgrade @rtsao/react-ssr-prepass ([#481](https://github.com/uber/fusionjs/pull/481))

## fusion-scaffolder
> *Changes since v1.0.4*

 - Fix broken link in fusion-plugin-react-redux README ([#439](https://github.com/uber/fusionjs/pull/439))

## fusion-tokens
> *Changes since v2.0.4*

 - Fix broken link in fusion-plugin-react-redux README ([#439](https://github.com/uber/fusionjs/pull/439))

## jazelle
> *Changes since v0.0.0-alpha.1*

 - Previous resolution check was too broad and caused false positives ([#411](https://github.com/uber/fusionjs/pull/411))
 - Ensure temp directory exists in jazelle  install and run ([#429](https://github.com/uber/fusionjs/pull/429))
 - Allow isolation of dep installations ([#435](https://github.com/uber/fusionjs/pull/435))
 - Ensure Bazelisk doesn't die on github rate limiting error if jazelle runs in fresh machine ([#440](https://github.com/uber/fusionjs/pull/440))
 - Refactor symlinking code to separate file ([#449](https://github.com/uber/fusionjs/pull/449))
 - Fix README path for checking checksums ([#422](https://github.com/uber/fusionjs/pull/422))
 - Use local package registry when installing packages and dependencies ([#466](https://github.com/uber/fusionjs/pull/466))

<details>
<summary>Dependency upgrades</summary>

Packages with updated dependencies

## @uber/fusion-plugin-atreyu
## @uber/fusion-metrics
## @uber/fusion-plugin-analytics-session
## @uber/fusion-plugin-auth-headers
## @uber/fusion-plugin-bedrock-compat
## @uber/fusion-plugin-error-handling
## @uber/fusion-plugin-events-adapter
## @uber/fusion-plugin-feature-toggles-react
## @uber/fusion-plugin-flipr
## @uber/fusion-plugin-galileo
## @uber/fusion-plugin-google-analytics
## @uber/fusion-plugin-google-analytics-react
## @uber/fusion-plugin-graphql-logging-middleware
## @uber/fusion-plugin-graphql-metrics
## @uber/fusion-plugin-heatpipe
## @uber/fusion-plugin-initial-state-compat
## @uber/fusion-plugin-logtron
## @uber/fusion-plugin-logtron-react
## @uber/fusion-plugin-m3
## @uber/fusion-plugin-m3-react
## @uber/fusion-plugin-magellan
## @uber/fusion-plugin-marketing
## @uber/fusion-plugin-page-skeleton-compat
## @uber/fusion-plugin-proxy-compat
## @uber/fusion-plugin-rosetta
## @uber/fusion-plugin-secrets
## @uber/fusion-plugin-secure-headers
## @uber/fusion-plugin-tchannel
## @uber/fusion-plugin-tealium
## @uber/fusion-plugin-tealium-react
## @uber/fusion-plugin-tracer
## @uber/fusion-plugin-uber-xhr-compat
## @uber/fusion-plugin-universal-logger-compat
## @uber/fusion-plugin-universal-m3-compat
## @uber/fusion-plugin-web-rpc-compat
## create-fusion-app
## create-fusion-plugin
## fusion-plugin-browser-performance-emitter
## fusion-plugin-connected-react-router
## fusion-plugin-csrf-protection
## fusion-plugin-error-handling
## fusion-plugin-http-handler
## fusion-plugin-introspect
## fusion-plugin-node-performance-emitter
## fusion-plugin-react-helmet-async
## fusion-plugin-react-redux
## fusion-plugin-react-router
## fusion-plugin-redux-action-emitter-enhancer
## fusion-plugin-rpc-redux-react
## fusion-plugin-service-worker
## fusion-plugin-styletron-react
## fusion-plugin-universal-events-react
## fusion-plugin-universal-logger
## fusion-plugin-web-app-manifest
## fusion-test-utils
## jazelle

</details>
