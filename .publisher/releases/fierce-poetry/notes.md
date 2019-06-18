# @uber/create-uber-web
> *Changes since v3.0.3*

 - Add @uber/fusion-plugin-feature-toggles-react to 'website' scaffold
 - Add codemod to easily install @uber/fusion-plugin-feature-toggles
 - Add a link to the provisioning FAQ for uOwn step (#156)
 - Preserve peer dependency versions when running `upgrade` (#157)
 - Add codemod to upgrade `fusion-plugin-font-loader-react` (#158)
 - Ignore files annotated with `// @noflow` directive when running Flow transformations
 - Update @uber/atreyu version
 - Upgrade `fusion-plugin-font-loader-react` version in website scaffold to `1.2.0` (#166)


# @uber/fusion-dev-cli
> *Changes since v2.0.2*

 - Ensure Fusion.js starts after Cerberus is ready to accept requests


# @uber/fusion-migrate
> *Changes since v1.0.2*

 - Merge engines and lint steps into the first step (#140)
 - Add code which wraps errors in ResponseError objects for rpcs (#142)
 - Add codemod to prevent `react-axe` from being included in production bundles
 - Add atreyu v6 to default upgrade
 - Fix browserHistoryCompat with import local



# @uber/fusion-plugin-events-adapter
> *Changes since v2.0.4*

 - Add `_trackingMeta` property to `custom-hp-web-event`
 - Improve checks for heatpipePublish API (#103)
 - Upgraded @uber/fusion-plugin-analytics-session dependency
 - Upgraded @uber/fusion-plugin-auth-headers dependency
 - Upgraded @uber/fusion-plugin-heatpipe dependency
 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-i18n dependency
 - Upgraded fusion-plugin-universal-events dependency
 - Upgraded fusion-tokens dependency



# @uber/fusion-plugin-logtron
> *Changes since v2.0.2*

 - Fix problem with source-map confusion while processing isomorphic-fetch (#169)
 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-logtron-react
> *Changes since v2.0.2*

 - Sync exports from logtron plugins
 - Upgraded @uber/fusion-plugin-logtron dependency
 - Upgraded fusion-react dependency
 - Upgraded fusion-tokens dependency


# eslint-config-fusion
> *Changes since v6.0.0*

 - Fix conflict between Flow and Prettier rules

# fusion-cli
> *Changes since v2.0.4*

 - Support dynamically loading translations by translation key
 - Allow transpilation of files with `.mjs` extensions (#150)
 - Add support for bazel (#155)
 - Support dynamic translations (#146)
 - Add support for configuring Jest `transformIgnorePatterns` via `jest.transformIgnorePatterns` in `.fusionrc.js` (#176)
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# fusion-core
> *Changes since v2.0.0*

 - Throw link to orphaned error description (#108)
 - Fix broken `ctx.url` in client-side context (#180)

# fusion-plugin-apollo
> *Changes since v2.0.0*

 - Add `GetDataFromTreeToken`
 - Upgraded fusion-core dependency
 - Upgraded fusion-react dependency
 - Upgraded fusion-tokens dependency


# fusion-plugin-i18n
> *Changes since v2.1.0*

 - Support dynamically loading translations by translation key
 - Support dynamic translations (#146)
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# fusion-plugin-i18n-react
> *Changes since v2.1.1*

 - Support dynamically loading translations by translation key
 - Upgrade React Context and remove usage of legacy React Context
 - Add `useTranslations` hook to support dynamic translations (#146)
 - Upgraded fusion-plugin-i18n dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-react dependency


# fusion-plugin-rpc
> *Changes since v3.0.1*

 - Add RPC stats from the browser (#130)
 - Add `RPCHandlersConfigToken` to fusion-plugin-rpc for customizing api path (#131)
 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency
 - Upgraded fusion-tokens dependency

# fusion-plugin-rpc-redux-react
> *Changes since v3.0.1*

 - Fix memory leak (#450)
 - Remove legacy context (#109)
 - Fix string interpolation in README (#159)
 - Upgraded fusion-core dependency
 - Upgraded fusion-react dependency
 - Upgraded fusion-plugin-rpc dependency
 - Upgraded fusion-plugin-react-redux dependency


# fusion-plugin-universal-events-react
> *Changes since v2.0.2*

 - Add re-exports for the `UniversalEventsDepsType` and `UniversalEventsType` types from `fusion-plugin-universal-events`
 - Upgraded fusion-react dependency
 - Upgraded fusion-plugin-universal-events dependency
 - Upgraded fusion-test-utils dependency
 - Upgraded fusion-react dependency


# fusion-plugin-web-app-manifest
 - Initial release

# fusion-react
> *Changes since v3.0.0*

 - Support dynamically loading translations by translation key
 - Allow plugin Providers to depend on ServiceContext Provider (#116)
 - Fix support for React Portals (#173)
 - Upgraded fusion-core dependency


<details>
 <summary>Packages with only monorepo dependencu upgrades</summary>


# @uber/fusion-metrics
> *Changes since v1.0.1*

 - Upgraded fusion-plugin-introspect dependency


# @uber/fusion-plugin-analytics-session
> *Changes since v2.0.1*

 - Upgraded fusion-core dependency

# @uber/fusion-plugin-atreyu
> *Changes since v2.0.2*

 - Upgraded @uber/fusion-plugin-galileo dependency
 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded @uber/fusion-plugin-tchannel dependency
 - Upgraded @uber/fusion-plugin-tracer dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-auth-headers
> *Changes since v3.0.0*

 - Upgraded fusion-core dependency

# @uber/fusion-plugin-bedrock-compat
> *Changes since v2.0.2*

 - Upgraded @uber/fusion-plugin-atreyu dependency
 - Upgraded @uber/fusion-plugin-flipr dependency
 - Upgraded @uber/fusion-plugin-galileo dependency
 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-error-handling
> *Changes since v2.0.2*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-feature-toggles
> *Changes since v3.0.2*

 - Upgraded @uber/fusion-plugin-atreyu dependency
 - Upgraded fusion-core dependency

# @uber/fusion-plugin-feature-toggles-react
> *Changes since v3.0.2*

 - Upgraded fusion-react dependency
 - Upgraded @uber/fusion-plugin-feature-toggles dependency
 - Upgraded fusion-core dependency

# @uber/fusion-plugin-flipr
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-galileo
> *Changes since v2.0.2*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded @uber/fusion-plugin-tracer dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-google-analytics
> *Changes since v2.0.1*

 - Upgraded fusion-core dependency

# @uber/fusion-plugin-google-analytics-react
> *Changes since v2.0.1*

 - Upgraded @uber/fusion-plugin-google-analytics dependency
 - Upgraded fusion-react dependency


# @uber/fusion-plugin-graphql-logging-middleware
 - Initial release from monorepo
 - No changes from prior version

# @uber/fusion-plugin-heatpipe
> *Changes since v3.0.2*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-heatpipe-performance-logger
> *Changes since v1.0.2*

 - Upgraded fusion-plugin-universal-events dependency
 - Upgraded fusion-core dependency

# @uber/fusion-plugin-initial-state-compat
> *Changes since v1.0.0*

 - Upgraded fusion-core dependency

# @uber/fusion-plugin-m3
> *Changes since v2.0.2*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency

# @uber/fusion-plugin-m3-react
> *Changes since v2.0.2*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-react dependency
 
# @uber/fusion-plugin-magellan
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency
 
# @uber/fusion-plugin-marketing
> *Changes since v2.0.2*

 - Upgraded @uber/fusion-plugin-heatpipe dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-page-skeleton-compat
> *Changes since v1.0.1*

 - Upgraded fusion-core dependency

# @uber/fusion-plugin-proxy-compat
> *Changes since v1.0.2*

 - Upgraded @uber/fusion-plugin-galileo dependency
 - Upgraded @uber/fusion-plugin-tracer dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-react-router-v3-compat
> *Changes since v2.0.5*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-react-router dependency

# @uber/fusion-plugin-rosetta
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency
 
# @uber/fusion-plugin-s3-asset-proxying
> *Changes since v2.0.1*

 - Upgraded fusion-core dependency

# @uber/fusion-plugin-secrets
> *Changes since v2.0.1*

 - Upgraded fusion-core dependency

# @uber/fusion-plugin-secure-headers
> *Changes since v4.0.1*

 - Upgraded fusion-core dependency

# @uber/fusion-plugin-tchannel
> *Changes since v2.0.2*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-tealium
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-tealium-react
> *Changes since v2.0.1*

 - Upgraded @uber/fusion-plugin-tealium dependency
 - Upgraded fusion-react dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-tracer
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-uber-xhr-compat
> *Changes since v1.0.1*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency
 
# @uber/fusion-plugin-universal-logger-compat
> *Changes since v1.0.1*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# @uber/fusion-plugin-universal-m3-compat
> *Changes since v1.0.2*

 - Upgraded @uber/fusion-plugin-m3 dependency
 - Upgraded fusion-core dependency

# @uber/fusion-plugin-web-rpc-compat
> *Changes since v1.0.2*

 - Upgraded fusion-plugin-rpc dependency
 - Upgraded fusion-core dependency


# fusion-plugin-browser-performance-emitter
> *Changes since v2.1.2*

 - Upgraded fusion-core dependency

# fusion-plugin-connected-react-router
> *Changes since v2.0.2*

 - Upgraded fusion-plugin-react-router dependency
 - Upgraded fusion-plugin-react-redux dependency
 - Upgraded fusion-core dependency

# fusion-plugin-csrf-protection
> *Changes since v3.0.0*

 - Upgraded fusion-core dependency

# fusion-plugin-error-handling
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency

# fusion-plugin-font-loader-react
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency
 - Upgraded fusion-react dependency

# fusion-plugin-http-handler
> *Changes since v1.0.1*

 - Upgraded fusion-core dependency


# fusion-plugin-introspect
> *Changes since v1.0.1*

 - Upgraded fusion-core dependency

# fusion-plugin-jwt
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency

# fusion-plugin-node-performance-emitter
> *Changes since v2.0.2*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency

# fusion-plugin-react-helmet-async
> *Changes since v2.0.2*

 - Upgraded fusion-core dependency

# fusion-plugin-react-redux
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency

# fusion-plugin-react-router
> *Changes since v2.0.2*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency

# fusion-plugin-redux-action-emitter-enhancer
> *Changes since v3.0.2*

 - Upgraded fusion-core dependency
 - Upgraded fusion-plugin-universal-events dependency


# fusion-plugin-service-worker
> *Changes since v3.0.5*

 - Upgraded fusion-cli dependency
 - Upgraded fusion-core dependency

# fusion-plugin-styletron-react
> *Changes since v3.0.3*

 - Upgraded fusion-core dependency

# fusion-plugin-universal-events
> *Changes since v2.0.1*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency


# fusion-plugin-universal-logger
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency
 - Upgraded fusion-tokens dependency


# fusion-test-utils
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency

# fusion-tokens
> *Changes since v2.0.0*

 - Upgraded fusion-core dependency


</details>
