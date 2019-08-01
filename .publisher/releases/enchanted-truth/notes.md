## Changes affecting all packages
 - Add [`"sideEffects": false` field](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free) to the package.json of all Fusion plugins ([#323](https://github.com/uber/fusionjs/pull/323))
 - Upgrade Flow version to 0.102.0 ([#261](https://github.com/uber/fusionjs/pull/261))

## @uber/create-uber-web
> *Changes since v3.2.0*

 - Fix peer dep warnings ([#252](https://github.com/uber/fusionjs/pull/252))
 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - fix lint & flow issues ([#256](https://github.com/uber/fusionjs/pull/256))
 - Add AtomicPrefixToken registration to the scaffold ([#254](https://github.com/uber/fusionjs/pull/254))
 - Remove introspect installation codemod ([#288](https://github.com/uber/fusionjs/pull/288))
 - Add codemod for graphql-metrics ([#290](https://github.com/uber/fusionjs/pull/290))
 - Add bazelignore codemod and cerberus config ([#296](https://github.com/uber/fusionjs/pull/296))
 - Remove unneeded binary from create-uber-web ([#303](https://github.com/uber/fusionjs/pull/303))
 - Update default healthline/sentry dsn for new zone turnup ([#306](https://github.com/uber/fusionjs/pull/306))
 - Change default font to `UberMoveText` ([#313](https://github.com/uber/fusionjs/pull/313))
 - Update dependency versions in fusion-plugin-apollo ([#327](https://github.com/uber/fusionjs/pull/327))
 - Upgrade analytics ([#333](https://github.com/uber/fusionjs/pull/333))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))
 - update baseui-codemods to avoid bin error ([#346](https://github.com/uber/fusionjs/pull/346))
 - Fix edge case with optional dependencies ([#345](https://github.com/uber/fusionjs/pull/345))
 - Upgrade baseui-codemods version ([#349](https://github.com/uber/fusionjs/pull/349))
 - Remove i18n/rosetta from scaffolds ([#348](https://github.com/uber/fusionjs/pull/348))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>

## @uber/fusion-migrate
> *Changes since v1.2.0*

 - Adjust fusion-migrate tests to use snapshots for codemods ([#307](https://github.com/uber/fusionjs/pull/307))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>

## @uber/fusion-plugin-analytics-session
> *Changes since v2.0.3*

 - Fix README typos ([#238](https://github.com/uber/fusionjs/pull/238))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## @uber/fusion-plugin-atreyu
> *Changes since v2.0.4*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>

## @uber/fusion-plugin-events-adapter
> *Changes since v2.1.1*

 - Fix README typo ([#238](https://github.com/uber/fusionjs/pull/238))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## @uber/fusion-plugin-feature-toggles
> *Changes since v3.0.4*

 - Export `MorpheusContextType` Flow type ([#164](https://github.com/uber/fusionjs/pull/164))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>

## @uber/fusion-plugin-graphql-metrics
> *Changes since v1.0.0*

 - Add support for passing `Date` objects to m3 timing ([#259](https://github.com/uber/fusionjs/pull/259))
 - Fix bug where query was being executed twice ([#266](https://github.com/uber/fusionjs/pull/266))
 - Update fusion-plugin-graphql-metrics and fusion-plugin-apollo ([#287](https://github.com/uber/fusionjs/pull/287))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>

## @uber/fusion-plugin-m3
> *Changes since v2.0.4*

 - Add support for passing `Date` objects to m3 timing ([#259](https://github.com/uber/fusionjs/pull/259))
 - Update date handling in the browser ([#260](https://github.com/uber/fusionjs/pull/260))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>

## @uber/fusion-plugin-tealium
> *Changes since v2.0.2*

 - Export `TealiumConfigType`, `TealiumType`, and `TealiumDepsType` Flow types ([#163](https://github.com/uber/fusionjs/pull/163))
 - Don't include tealium script if config is incomplete (https://github.com/uber/fusionjs/pull/56)

<details>
<summary>Dependency upgrades</summary>

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## @uber/fusion-plugin-tracer
> *Changes since v2.0.2*

 - Add Flow types ([#285](https://github.com/uber/fusionjs/pull/285))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>

## fusion-cli
> *Changes since v2.2.0*

 - Fix promise instrumentation ([#330](https://github.com/uber/fusionjs/pull/330))
 - Add defensive check for `displayError.stack` ([#129](https://github.com/uber/fusionjs/pull/129))
 - Pass query string after stripping route prefix ([#134](https://github.com/uber/fusionjs/pull/134))

<details>
<summary>Dependency upgrades</summary>

 - Fix peer dep warnings ([#252](https://github.com/uber/fusionjs/pull/252))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>

## fusion-core
> *Changes since v2.0.2*

 - Export `ExtractTokenType` helper and minor type improvements ([#301](https://github.com/uber/fusionjs/pull/301))
 - Fix edge case with optional dependencies ([#345](https://github.com/uber/fusionjs/pull/345))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## fusion-plugin-apollo
> *Changes since v2.0.2*

 - Update fusion-plugin-graphql-metrics and fusion-plugin-apollo ([#287](https://github.com/uber/fusionjs/pull/287))
 - Update executor to handle errors correctly ([#342](https://github.com/uber/fusionjs/pull/342))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update dependency versions in fusion-plugin-apollo ([#327](https://github.com/uber/fusionjs/pull/327))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## fusion-plugin-connected-react-router
> *Changes since v2.0.4*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Add Jest to dev dependencies for fusion-plugin-connected-react-router ([#276](https://github.com/uber/fusionjs/pull/276))
 - Add more devDeps to a few more packages ([#282](https://github.com/uber/fusionjs/pull/282))

</details>

## fusion-plugin-font-loader-react
> *Changes since v2.0.2*

 - Handle forward Refs in withFontLoading HoC ([#265](https://github.com/uber/fusionjs/pull/265))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## fusion-plugin-i18n
> *Changes since v2.2.1*

 - Expand interpolations parameter type for i18n#translate function ([#251](https://github.com/uber/fusionjs/pull/251))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## fusion-plugin-i18n-react
> *Changes since v3.0.1*

 - Test that i18n has correct properties ([#249](https://github.com/uber/fusionjs/pull/249))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>

## fusion-plugin-introspect
> *Changes since v1.0.3*

 - Ensure _diagnostics route always 200's even after handling payload ([#318](https://github.com/uber/fusionjs/pull/318))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## fusion-plugin-react-redux
> *Changes since v2.0.2*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Export `GetInitialStateType`, `StoreWithContextType`, `ReactReduxDepsType`, and `ReactReduxServiceType` Flow types ([#298](https://github.com/uber/fusionjs/pull/298))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## fusion-plugin-redux-action-emitter-enhancer
> *Changes since v3.0.4*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## fusion-plugin-rpc-redux-react
> *Changes since v4.0.1*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))

<details>
<summary>Dependency upgrades</summary>


 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Add jest as a devDep rpc_redux_react ([#279](https://github.com/uber/fusionjs/pull/279))
 - Add more devDeps to a few more packages ([#282](https://github.com/uber/fusionjs/pull/282))

</details>

## fusion-plugin-service-worker
> *Changes since v3.0.7*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - send 500 and log error ([#309](https://github.com/uber/fusionjs/pull/309))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>

## fusion-plugin-universal-events
> *Changes since v2.0.3*

 - Add `Promise<void>` as valid callback return for `universalEvents.on` handler ([#326](https://github.com/uber/fusionjs/pull/326))

<details>
<summary>Dependency upgrades</summary>


 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>

## fusion-react
> *Changes since v3.1.1*

 - Fix some peer dep warnings ([#252](https://github.com/uber/fusionjs/pull/252))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## fusion-test-utils
> *Changes since v2.0.2*

 - Add optional 'timeout' argument to fusion-test-utils' 'test' export ([#293](https://github.com/uber/fusionjs/pull/293))

<details>
<summary>Dependency upgrades</summary>

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

</details>

## jazelle
 - Fix lockfile corruption ([#310](https://github.com/uber/fusionjs/pull/310))
 - Import Jazelle ([#102](https://github.com/uber/fusionjs/pull/102))
 - better error if running doctor without install ([#281](https://github.com/uber/fusionjs/pull/281))
 - fix bin symlinks for local deps ([#284](https://github.com/uber/fusionjs/pull/284))
 - Provide some output from `jazelle changes` in host mode  ([#291](https://github.com/uber/fusionjs/pull/291))
 - Implement bump command ([#297](https://github.com/uber/fusionjs/pull/297))
 - Prevent jazelle install failure if repo has yarnrc w/ frozen-lockfile set ([#311](https://github.com/uber/fusionjs/pull/311))
 - Fix existing lock file corruptions, if any ([#321](https://github.com/uber/fusionjs/pull/321))
 - Add ability to specify commit range for jazelle changes ([#324](https://github.com/uber/fusionjs/pull/324))
 - Make small improvements to Jazelle ([#325](https://github.com/uber/fusionjs/pull/325))
 - Add dependency crawling to jazelle changes ([#350](https://github.com/uber/fusionjs/pull/350))

---

<details>
 <summary>📦Packages published with only dependency upgrades and/or Flow type improvements</summary>

## @uber/fusion-analyticsjs-utils
> *Changes since v2.0.0*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-dev-cli
> *Changes since v2.0.4*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-legacy-styling-compat-mixin
> *Changes since v2.0.0*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-metrics
> *Changes since v1.0.3*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-auth-headers
> *Changes since v3.0.2*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-bedrock-compat
> *Changes since v2.0.4*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-error-handling
> *Changes since v2.0.4*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))


## @uber/fusion-plugin-feature-toggles-react
> *Changes since v3.0.4*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-flipr
> *Changes since v2.0.2*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## @uber/fusion-plugin-galileo
> *Changes since v2.0.4*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Add support for passing Date objects to m3 timing ([#259](https://github.com/uber/fusionjs/pull/259))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Add types into fusion-plugin-tracer ([#285](https://github.com/uber/fusionjs/pull/285))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## @uber/fusion-plugin-google-analytics
> *Changes since v2.0.3*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-google-analytics-react
> *Changes since v2.0.3*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-graphql-logging-middleware
> *Changes since v1.0.1*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-heatpipe
> *Changes since v3.0.4*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-initial-state-compat
> *Changes since v1.0.2*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-logtron
> *Changes since v2.0.4*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## @uber/fusion-plugin-logtron-react
> *Changes since v2.1.1*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-m3-react
> *Changes since v2.0.4*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-magellan
> *Changes since v2.0.2*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-marketing
> *Changes since v2.0.4*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## @uber/fusion-plugin-page-skeleton-compat
> *Changes since v1.0.3*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-proxy-compat
> *Changes since v1.0.4*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Add types into fusion-plugin-tracer ([#285](https://github.com/uber/fusionjs/pull/285))

## @uber/fusion-plugin-react-router-v3-compat
> *Changes since v2.0.7*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## @uber/fusion-plugin-rosetta
> *Changes since v2.1.0*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## @uber/fusion-plugin-s3-asset-proxying
> *Changes since v2.0.3*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## @uber/fusion-plugin-secrets
> *Changes since v2.0.3*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-secure-headers
> *Changes since v5.0.3*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-tchannel
> *Changes since v2.0.4*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-tealium-react
> *Changes since v2.0.3*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-uber-xhr-compat
> *Changes since v1.0.3*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## @uber/fusion-plugin-universal-logger-compat
> *Changes since v1.0.3*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-universal-m3-compat
> *Changes since v1.0.4*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## @uber/fusion-plugin-web-rpc-compat
> *Changes since v1.0.4*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## create-fusion-app
> *Changes since v1.0.3*

 - Fix GitHub-flagged vulnerabilities ([#271](https://github.com/uber/fusionjs/pull/271))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## create-fusion-plugin
> *Changes since v1.0.3*

 ([#271](https://github.com/uber/fusionjs/pull/271))

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## eslint-config-fusion
> *Changes since v6.0.1*

 - Fix peer dep warnings ([#252](https://github.com/uber/fusionjs/pull/252))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## fusion-plugin-browser-performance-emitter
> *Changes since v2.1.4*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## fusion-plugin-csrf-protection
> *Changes since v3.0.2*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## fusion-plugin-error-handling
> *Changes since v2.1.0*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## fusion-plugin-http-handler
> *Changes since v1.0.3*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## fusion-plugin-jwt
> *Changes since v2.0.2*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## fusion-plugin-node-performance-emitter
> *Changes since v2.0.4*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## fusion-plugin-react-helmet-async
> *Changes since v2.0.4*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## fusion-plugin-react-router
> *Changes since v2.0.4*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## fusion-plugin-rpc
> *Changes since v3.1.1*

 - Upgrade to react redux 7 ([#244](https://github.com/uber/fusionjs/pull/244))
 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Update scaffold baseui to v8 ([#226](https://github.com/uber/fusionjs/pull/226))

## fusion-plugin-styletron-react
> *Changes since v3.0.5*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## fusion-plugin-universal-events-react
> *Changes since v2.1.1*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## fusion-plugin-universal-logger
> *Changes since v2.0.2*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## fusion-plugin-web-app-manifest
> *Changes since v1.0.1*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))
 - Add fusion-tokens to dev dependency ([#329](https://github.com/uber/fusionjs/pull/329))

## fusion-rpc-redux
> *Changes since v2.0.1*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## fusion-scaffolder
> *Changes since v1.0.3*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

## fusion-tokens
> *Changes since v2.0.2*

 - Upgrade dependencies ([#270](https://github.com/uber/fusionjs/pull/270))

</details>