## Changes affecting several packages:

 - Delete vestigial files ([#844](https://github.com/uber/fusionjs/pull/844))
 - Add lockstep version policy ([#868](https://github.com/uber/fusionjs/pull/868))
 - Prevent tests from being published ([#890](https://github.com/uber/fusionjs/pull/890))

## @uber/fusion-plugin-auth-headers
> *Changes since v3.1.0*

 - Export "type AuthHeadersService" from fusion-plugin-auth-headers ([#857](https://github.com/uber/fusionjs/pull/857))

## @uber/fusion-plugin-error-handling
> *Changes since v2.1.0*

 - Add UserAgent to Healthline logs ([#873](https://github.com/uber/fusionjs/pull/873))

## @uber/fusion-plugin-feature-toggles
> *Changes since v3.1.0*

 - Include treatment group names as part of default metadata transformer ([#894](https://github.com/uber/fusionjs/pull/894))

## @uber/fusion-plugin-flipr
> *Changes since v2.1.0*

 - Allow defaultNamespace and propertiesNamespaces to be passed to flipr ([#846](https://github.com/uber/fusionjs/pull/846))

## @uber/fusion-plugin-heatpipe
> *Changes since v3.1.0*

 - Add config to Heatpipe plugin to allow ignoring universal events ([#878](https://github.com/uber/fusionjs/pull/878))
 - Export config token for heatpipe plugin ([#883](https://github.com/uber/fusionjs/pull/883))

## @uber/fusion-plugin-logger
> *Changes since v0.1.0*

 - Add missing healthline data, fix edge cases, better tests ([#854](https://github.com/uber/fusionjs/pull/854))
 - Add UserAgent to Healthline logs ([#873](https://github.com/uber/fusionjs/pull/873))
 - Add simple M3 logging to new logger ([#889](https://github.com/uber/fusionjs/pull/889))

## @uber/fusion-plugin-logtron
> *Changes since v2.1.0*

 - Apply new `fusion-plugin-logger` to `fusion-plugin-logtron` ([#893](https://github.com/uber/fusionjs/pull/893))

## @uber/fusion-plugin-logtron-react
> *Changes since v2.2.0*

 - Apply new `fusion-plugin-logger` to `fusion-plugin-logtron` ([#893](https://github.com/uber/fusionjs/pull/893))

## eslint-config-fusion
> *Changes since v6.1.0*

 - Add dot-notation error rule ([#829](https://github.com/uber/fusionjs/pull/829))

## fusion-cli
> *Changes since v2.7.0*

 - Add option to limit number of workers spawn during build ([#847](https://github.com/uber/fusionjs/pull/847))

## fusion-core
> *Changes since v2.1.0*

 - Add type helper for extracting deps types ([#892](https://github.com/uber/fusionjs/pull/892))

## fusion-plugin-csrf-protection
> *Changes since v3.1.0*

 - Add docs for useService and fetch token ([#881](https://github.com/uber/fusionjs/pull/881))

## fusion-plugin-rpc
> *Changes since v3.4.0*

 - Add `useRPCRedux` hook ([#875](https://github.com/uber/fusionjs/pull/875))

## fusion-plugin-rpc-redux-react
> *Changes since v4.2.0*

 - Fix import for non-public `ReactReduxContext` ([#853](https://github.com/uber/fusionjs/pull/853))
 - Add `useRPCRedux` hook ([#875](https://github.com/uber/fusionjs/pull/875))

## fusion-react
> *Changes since v3.2.0*

 - Add client-side render fallback when SSR fails ([#882](https://github.com/uber/fusionjs/pull/882))

## fusion-rpc-redux
> *Changes since v2.1.0*

 - Add `useRPCRedux` hook ([#875](https://github.com/uber/fusionjs/pull/875))

## jazelle
> *Changes since v0.0.0-alpha.9*

 - Allow `jazelle upgrade` to receive multiple package names ([#839](https://github.com/uber/fusionjs/pull/839))
 - Improve speed of lockfile additions ([#843](https://github.com/uber/fusionjs/pull/843))
 - Implement `jazelle align` command ([#851](https://github.com/uber/fusionjs/pull/851))
 - Use `--pure-lockfile` instead of `--frozen-lockfile` ([#855](https://github.com/uber/fusionjs/pull/855))
 - Don't add Bazel target if a related one already exists ([#858](https://github.com/uber/fusionjs/pull/858))
 - Implement batch add ([#859](https://github.com/uber/fusionjs/pull/859))
 - Allow web_binary to specify multiple output folders ([#863](https://github.com/uber/fusionjs/pull/863))
 - Implement `outdated` command ([#860](https://github.com/uber/fusionjs/pull/860))
 - List only jazelle targets in `jazelle changes` ([#869](https://github.com/uber/fusionjs/pull/869))
 - Do align on add ([#876](https://github.com/uber/fusionjs/pull/876))
 - Pass through env vars to child process in `jazelle each` ([#877](https://github.com/uber/fusionjs/pull/877))
 - Implement scaffold command ([#879](https://github.com/uber/fusionjs/pull/879))
 - Filter non-jazelle targets from `jazelle changes` output ([#880](https://github.com/uber/fusionjs/pull/880))
 - Allow '.' as a valid value in manifest.json projects field ([#884](https://github.com/uber/fusionjs/pull/884))
 - Optimize `checking lockfiles` ([#885](https://github.com/uber/fusionjs/pull/885))
 - Add debugging logic to bootstrapper ([#887](https://github.com/uber/fusionjs/pull/887))
 - Optimize upgrade ([#888](https://github.com/uber/fusionjs/pull/888))
 - List all targets if bazel version changes ([#891](https://github.com/uber/fusionjs/pull/891))
