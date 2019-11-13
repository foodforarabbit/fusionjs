## Changes affecting all packages
 - Upgrade to Flow 0.109.0 [#682](https://github.com/uber/fusionjs/pull/682)
 
## @uber/create-uber-web
> *Changes since v4.1.1*

 - Fix flow type issues with integration tests [#640](https://github.com/uber/fusionjs/pull/640)
 - Allow sanitizing an empty string [#643](https://github.com/uber/fusionjs/pull/643)
 - Update create-uber-web readme for provisioning [#654](https://github.com/uber/fusionjs/pull/654)
 - Move @uber/typed-rpc-cli into dependencies of graphql scaffold [#651](https://github.com/uber/fusionjs/pull/651)
 - Add codemod for typed-rpc-cli [#664](https://github.com/uber/fusionjs/pull/664)
 - Upgrade standard-fonts in scaffolds [#684](https://github.com/uber/fusionjs/pull/684)
 - Add fusion-plugin-i18n to scaffolds [#686](https://github.com/uber/fusionjs/pull/686)
 - Add '@uber/fusion-plugin-marketing' as a scaffold dependency [#690](https://github.com/uber/fusionjs/pull/690)
 - Remove nunjucks usage for package name in website templates [#689](https://github.com/uber/fusionjs/pull/689)
 - Add Feature Toggles plugin to `graphql-website` template [#688](https://github.com/uber/fusionjs/pull/688)
 - Update feature toggles plugin and use it in upgrade [#691](https://github.com/uber/fusionjs/pull/691)

## @uber/fusion-plugin-feature-toggles
> *Changes since v3.0.8*

 - Add optional dependency on @uber/fusion-plugin-marketing [#653](https://github.com/uber/fusionjs/pull/653)
 - Remove package dependency on `react` [#668](https://github.com/uber/fusionjs/pull/668)

## @uber/fusion-plugin-feature-toggles-react
> *Changes since v3.0.9*

 - Make `react` a peer dependency [#663](https://github.com/uber/fusionjs/pull/663)

## @uber/fusion-plugin-graphql-logging-middleware
> *Changes since v1.0.7*

 - Add error log in fusion-plugin-apollo and update graphql version [#679](https://github.com/uber/fusionjs/pull/679)

## @uber/fusion-plugin-graphql-metrics
> *Changes since v1.1.1*

 - Add error log in fusion-plugin-apollo and update graphql version [#679](https://github.com/uber/fusionjs/pull/679)
 - Add validation to SSR query execution [#680](https://github.com/uber/fusionjs/pull/680)

## @uber/fusion-plugin-proxy-compat
> *Changes since v1.0.8*

 - Mark Galileo and Tracer as optional in fusion-plugin-proxy-compat [#648](https://github.com/uber/fusionjs/pull/648)

## @uber/fusion-plugin-secure-headers
> *Changes since v5.0.7*

 - Add TerraBlob CDN domains to CSP List [#646](https://github.com/uber/fusionjs/pull/646)

## create-fusion-app
> *Changes since v1.0.6*

 - Fix create-fusion-app linting and greenkeep [#639](https://github.com/uber/fusionjs/pull/639)

## fusion-cli
> *Changes since v2.4.3*

 - Make jest root consistent [#641](https://github.com/uber/fusionjs/pull/641)
 - Upgrade webpack [#650](https://github.com/uber/fusionjs/pull/650)
 - Add error log in fusion-plugin-apollo and update graphql version [#679](https://github.com/uber/fusionjs/pull/679)

## fusion-core
> *Changes since v2.0.6*

 - Allow sanitizing an empty string [#643](https://github.com/uber/fusionjs/pull/643)

## fusion-plugin-apollo
> *Changes since v3.2.0*

 - Add error log in fusion-plugin-apollo and update graphql version [#679](https://github.com/uber/fusionjs/pull/679)

## fusion-plugin-i18n
> *Changes since v2.3.3*

 - Fix translate interpolations parameter type to be read-only [#678](https://github.com/uber/fusionjs/pull/678)

## fusion-plugin-introspect
> *Changes since v1.0.8*

 - Don't throw if unable to create introspection report [#642](https://github.com/uber/fusionjs/pull/642)

## fusion-plugin-react-router
> *Changes since v2.1.0*

 - Fix issue with not exporting react router hooks [#644](https://github.com/uber/fusionjs/pull/644)

## fusion-plugin-styletron-react
> *Changes since v3.0.9*

 - Update styletron-engine-atomic and styletron-react [#594](https://github.com/uber/fusionjs/pull/594)

## fusion-scaffolder
> *Changes since v1.0.6*

 - Add templates to [ignore] section of public package flow configs [#675](https://github.com/uber/fusionjs/pull/675)

## jazelle
> *Changes since v0.0.0-alpha.5*

 - Add support for `-h` and `help` [#656](https://github.com/uber/fusionjs/pull/656)
 - Don't overwrite lockfile in `jazelle ci` [#657](https://github.com/uber/fusionjs/pull/657)
 - Fix Jazelle test log file path [#659](https://github.com/uber/fusionjs/pull/659)
 - Fix bugs [#661](https://github.com/uber/fusionjs/pull/661)
 - Improve speed of jazelle purge command [#665](https://github.com/uber/fusionjs/pull/665)
 - Fix default arg value when boolean arg comes first [#672](https://github.com/uber/fusionjs/pull/672)
 - Don't swallow hook output [#673](https://github.com/uber/fusionjs/pull/673)
 - Fix dependency version range deduping logic [#674](https://github.com/uber/fusionjs/pull/674)
 - Add templates to [ignore] section of public package flow configs [#675](https://github.com/uber/fusionjs/pull/675)
 - Fall back to root level if the query fails with a weird message [#677](https://github.com/uber/fusionjs/pull/677)
