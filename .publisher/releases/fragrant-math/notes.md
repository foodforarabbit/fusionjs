
## Changes affecting all packages

 - Remove upper limit from `engines.node` field([#745](https://github.com/uber/fusionjs/pull/745))

## @uber/create-uber-web
> *Changes since v4.3.1*

 - Add check for supported node version when upgrading ([#736](https://github.com/uber/fusionjs/pull/736))
 - Use monorepo versions in scaffold templates ([#738](https://github.com/uber/fusionjs/pull/738))
 - Fix publishing for React HOC templates ([#795](https://github.com/uber/fusionjs/pull/795))
 - Add override to upgrade logic for canary upgrades ([#799](https://github.com/uber/fusionjs/pull/799), [#800](https://github.com/uber/fusionjs/pull/800))
 - Fix `package.json` updating for codemods that modify dependencies ([#798](https://github.com/uber/fusionjs/pull/798))
 - Avoid parsing files in `flow-typed/` ([#777](https://github.com/uber/fusionjs/pull/777))
 - Combine multiple codemods to reduce AST parsing ([#774](https://github.com/uber/fusionjs/pull/774))
 - Add flow comment to files when annotations are added ([#773](https://github.com/uber/fusionjs/pull/773), [#762](https://github.com/uber/fusionjs/pull/762))
 - Fallback to latest version set for all official Fusion packages ([#760](https://github.com/uber/fusionjs/pull/760))

## @uber/fusion-dev-cli
> *Changes since v2.0.7*

 - Disable cerberus detection logic when starting fusion ([#748](https://github.com/uber/fusionjs/pull/748))

## @uber/fusion-plugin-bedrock-compat
> *Changes since v2.0.11*

 - Fix erroneous parsing of Jest config ([#763](https://github.com/uber/fusionjs/pull/763))

## @uber/fusion-plugin-events-adapter
> *Changes since v2.2.2*

 - Remove geolocation data injection ([#722](https://github.com/uber/fusionjs/pull/722))
 - Fix timestamps for batched heatpipe events ([#746](https://github.com/uber/fusionjs/pull/746))

## @uber/fusion-plugin-galileo
> *Changes since v2.0.10*

 - Update galileo ([#739](https://github.com/uber/fusionjs/pull/739))

## @uber/fusion-plugin-graphql-metrics
> *Changes since v1.1.3*

 - Skip the `KnownDirectivesRules` in query validation ([#753](https://github.com/uber/fusionjs/pull/753))

## @uber/fusion-plugin-s3-asset-proxying
> *Changes since v2.1.2*

 - Fix asset proxying taking precedence over local disk middleware ([#790](https://github.com/uber/fusionjs/pull/790))

## @uber/fusion-plugin-tracer
> *Changes since v2.0.8*

 - Use RouteTagsToken for name ([#789](https://github.com/uber/fusionjs/pull/789))

## create-fusion-app
> *Changes since v1.0.8*

 - Update link in template ([#750](https://github.com/uber/fusionjs/pull/750))

## fusion-cli
> *Changes since v2.5.0*

 - Kill the old node process upon reload when debugging in development ([#704](https://github.com/uber/fusionjs/pull/704))
 - Add new config option for handling default import side effects in fusion-cli ([#776](https://github.com/uber/fusionjs/pull/776))
 - Add SIGINT listener for `fusion dev` / `yarn dev` ([#786](https://github.com/uber/fusionjs/pull/786))
 - Add environment variable for serving source maps in a staging environment ([#727](https://github.com/uber/fusionjs/pull/727))
 - Fix dir flag for fusion dev ([#787](https://github.com/uber/fusionjs/pull/787))
 - Upgrade terser ([#791](https://github.com/uber/fusionjs/pull/791))
 - Add the `RouteNameTag` for `/_static` asset requests ([#792](https://github.com/uber/fusionjs/pull/792))

## fusion-core
> *Changes since v2.0.8*

 - Improve docs for `memoize` ([#741](https://github.com/uber/fusionjs/pull/741))
 - Implement RouteTagsToken ([#780](https://github.com/uber/fusionjs/pull/780))
 - Allow serving source maps in a staging environment ([#727](https://github.com/uber/fusionjs/pull/727))

## fusion-plugin-apollo
> *Changes since v3.3.1*

 - Update README ([#754](https://github.com/uber/fusionjs/pull/754))

## fusion-plugin-browser-performance-emitter
> *Changes since v2.1.10*

 - Avoid frequent require to "package.json" ([#771](https://github.com/uber/fusionjs/pull/771))

## fusion-plugin-i18n-react
> *Changes since v3.0.8*

 - Fix `Translate` component if i18n not provided in React context ([#747](https://github.com/uber/fusionjs/pull/747))

## fusion-plugin-react-router
> *Changes since v2.1.2*

 - Use `RouteTagsToken` ([#782](https://github.com/uber/fusionjs/pull/782))

## fusion-plugin-rpc
> *Changes since v3.3.3*

 - Add docs on `BodyParserOptionsToken` ([#759](https://github.com/uber/fusionjs/pull/759))
 - Support form data parsing ([#788](https://github.com/uber/fusionjs/pull/788))

## fusion-plugin-rpc-redux-react
> *Changes since v4.0.8*

 - Allow Redux sub-app pattern ([#766](https://github.com/uber/fusionjs/pull/766))

## fusion-plugin-universal-events
> *Changes since v2.0.9*

 - Set name RouteTag ([#804](https://github.com/uber/fusionjs/pull/804))

## fusion-rpc-redux
> *Changes since v2.0.6*

 - Change `Action` type ([#793](https://github.com/uber/fusionjs/pull/793))

## jazelle
> *Changes since v0.0.0-alpha.7*

 - Fix node_modules moving ([#742](https://github.com/uber/fusionjs/pull/742))
 - Add support for `targetRuleName` in manifest ([#743](https://github.com/uber/fusionjs/pull/743))
 - Attempt a fix for obscure semver error ([#744](https://github.com/uber/fusionjs/pull/744))
 - Use root node_modules/.bin instead of ${main}/module_modules/.bin ([#756](https://github.com/uber/fusionjs/pull/756))
 - Avoid collapsing different versions if one is a github alias ([#758](https://github.com/uber/fusionjs/pull/758))
 - Implement each command ([#775](https://github.com/uber/fusionjs/pull/775))
 - Throw when lockfiles are out of date ([#805](https://github.com/uber/fusionjs/pull/805))
