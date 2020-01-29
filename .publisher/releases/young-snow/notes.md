## Changes affecting all packages:

Internal refactoring, including:
- Upgrading monorepo to Node 12 ([#734](https://github.com/uber/fusionjs/pull/734))
- Using `create-universal-package` v4 ([#825](https://github.com/uber/fusionjs/pull/825))
- Migrating remaining tape test suites to Jest ([#825](https://github.com/uber/fusionjs/pull/825))

## @uber/create-uber-web
> *Changes since v5.0.0*

- Add `eslint-plugin-baseui` to templates and codemods ([#823](https://github.com/uber/fusionjs/pull/823))
- Update default versions for node/npm in scaffolds ([#835](https://github.com/uber/fusionjs/pull/835))
- Remove `react-redux` from upgrade blacklist ([#838](https://github.com/uber/fusionjs/pull/838))

## @uber/fusion-plugin-logger
 - Create `@uber/fusion-plugin-logger` ([#810](https://github.com/uber/fusionjs/pull/810))
 - Improve log formatting in dev environment ([#819](https://github.com/uber/fusionjs/pull/819))
 - Fix healthline title and explicitly callout when no stack ([#826](https://github.com/uber/fusionjs/pull/826))

## fusion-plugin-apollo
> *Changes since v3.3.2*

 - Set RouteTag name ([#803](https://github.com/uber/fusionjs/pull/803))
 
## fusion-plugin-i18n
> *Changes since v2.3.6*

 - Remove unused `rollup` dependencies ([#807](https://github.com/uber/fusionjs/pull/807))
 
## fusion-plugin-react-router
> *Changes since v2.1.3*

 - Update router to use setters on static context for handling redirects ([#801](https://github.com/uber/fusionjs/pull/801))
 - Remove usage of `React.Children.only` ([#809](https://github.com/uber/fusionjs/pull/809))

## fusion-plugin-rpc
> *Changes since v3.3.4*

 - Remove unused `rollup` dependencies ([#807](https://github.com/uber/fusionjs/pull/807))
 - Set RouteTag name ([#802](https://github.com/uber/fusionjs/pull/802))
 
## fusion-react
> *Changes since v3.1.9*

 - Use vanilla `react-ssr-prepass` ([#815](https://github.com/uber/fusionjs/pull/815))
 - Update flowtype for prepared ([#831](https://github.com/uber/fusionjs/pull/831))

## jazelle
> *Changes since v0.0.0-alpha.8*

 - Return correct list of deps if input to `jazelle changes` involves a file that is not tracked by Bazel ([#808](https://github.com/uber/fusionjs/pull/808))
 - Make install always generate same lockfiles ([#812](https://github.com/uber/fusionjs/pull/812))
 - Return correct result for empty changesets when there are untracked files ([#813](https://github.com/uber/fusionjs/pull/813))
 - Fix `jazelle changes` flags ([#816](https://github.com/uber/fusionjs/pull/816))
 - Add `jazelle bin-path` command ([#817](https://github.com/uber/fusionjs/pull/817))
 - Don't sync lockfiles if we don't need to ([#818](https://github.com/uber/fusionjs/pull/818))
 - Remove unnecessary caching logic ([#820](https://github.com/uber/fusionjs/pull/820))
 - Add Shebang ([#827](https://github.com/uber/fusionjs/pull/827))
 - Ensure that preinstall hook executes from root ([#828](https://github.com/uber/fusionjs/pull/828))
 - Fix flaky test ([#830](https://github.com/uber/fusionjs/pull/830))
