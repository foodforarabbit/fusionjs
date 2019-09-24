## Changes affecting all packages
 - Replace rush with jazelle to manage the monorepo ([#494](https://github.com/uber/fusionjs/pull/494)) See [`CONTRIBUTING.md`](https://github.com/uber/fusionjs/blob/master/CONTRIBUTING.md) for instructions.
 - Fix broken lock files across all private packages ([#521](https://github.com/uber/fusionjs/pull/521))
 
## @uber/create-uber-web
> *Changes since v3.4.0*

 - Upgrade fusion-plugin scaffold to create-universal-package@4 ([#490](https://github.com/uber/fusionjs/pull/490))
 - Upgrade library scaffold to create-universal-package@4 ([#492](https://github.com/uber/fusionjs/pull/492))
 - Update graphql scaffold to always skip prepare ([#510](https://github.com/uber/fusionjs/pull/510))
 - Fix setting team name in graphql scaffolds ([#512](https://github.com/uber/fusionjs/pull/512))
 - Upgrade scaffold to `baseui` version 9 ([#518](https://github.com/uber/fusionjs/pull/518))
 - Fix and prevent users from being able to scaffold with invalid service names ([#511](https://github.com/uber/fusionjs/pull/511))
 - Fix scaffolded apps not having the right package.json name ([#523](https://github.com/uber/fusionjs/pull/523))
 - Allow numbers when scaffolding a service ([#536](https://github.com/uber/fusionjs/pull/536))

## @uber/fusion-plugin-flipr
> *Changes since v2.0.5*

 - Do not delete flipr directory when running update-flipr-bootstrap ([#527](https://github.com/uber/fusionjs/pull/527))

## @uber/fusion-plugin-rosetta
> *Changes since v2.1.4*

 - Add mock for test ([#483](https://github.com/uber/fusionjs/pull/483))
 - Support locales from icu-data as opposed to the snapshot ([#495](https://github.com/uber/fusionjs/pull/495))
 
## fusion-cli
> *Changes since v2.4.0*

 - Prevent unnecessary files from being published to npm ([#493](https://github.com/uber/fusionjs/pull/493))
 - Prevent duplicate logged warnings ([#515](https://github.com/uber/fusionjs/pull/515))
 - Remove `.fusionrc.js` option for `experimentalSideEffectsTest` ([#507](https://github.com/uber/fusionjs/pull/507))
 - Improve build-time error messages and production build times by replacing `zopfli`-based gzip compression with `zlib` ([#520](https://github.com/uber/fusionjs/pull/520))
 - Fix bug with `window.onerror` when using a CDN by setting correct script cross-origin attributes ([#540](https://github.com/uber/fusionjs/pull/540))

## fusion-plugin-apollo
> *Changes since v3.0.0*

 - Add support for typeDefs for Apollo client ([#509](https://github.com/uber/fusionjs/pull/509))

## fusion-plugin-i18n
> *Changes since v2.3.1*

 - Handle legacy query params in translations requests ([#508](https://github.com/uber/fusionjs/pull/508))

## fusion-plugin-rpc
> *Changes since v3.2.1*

 - Add FormData support into fusion-plugin-rpc ([#502](https://github.com/uber/fusionjs/pull/502))

## jazelle
> *Changes since v0.0.0-alpha.2*

 - Add use-canary and scaffold test scripts for release testing ([#491](https://github.com/uber/fusionjs/pull/491))
 - Improve lockfile change detection and error message ([#496](https://github.com/uber/fusionjs/pull/496))
 - Ensure written package.json files end in newline ([#504](https://github.com/uber/fusionjs/pull/504))
 - Update lockfile generation logic w.r.t registry ([#522](https://github.com/uber/fusionjs/pull/522))
 - Implement parallelization commands in Jazelle ([#513](https://github.com/uber/fusionjs/pull/513))

## Other packages with updated dependencies
 - @uber/fusion-analyticsjs-utils
 - @uber/fusion-plugin-proxy-compat
