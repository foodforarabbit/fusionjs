## @uber/create-uber-web
> *Changes since v4.0.1*

 - Fix the resolution version so the scaffold can install ([#567](https://github.com/uber/fusionjs/pull/567))
 - Resolve 'graphql' to a single version (v14.5.4) ([#577](https://github.com/uber/fusionjs/pull/577))
 - Ask for user LDAP when provisioning ([#572](https://github.com/uber/fusionjs/pull/572))
 - Add @apollo/react-testing into scaffold deps ([#581](https://github.com/uber/fusionjs/pull/581))
 - Fix puppeteer import and flow types ([#587](https://github.com/uber/fusionjs/pull/587))
 - Remove unused download schema command ([#588](https://github.com/uber/fusionjs/pull/588))
 - Set default to styledFonts for new internal apps ([#589](https://github.com/uber/fusionjs/pull/589))

## @uber/fusion-plugin-events-adapter
> *Changes since v2.1.5*

 - Add support for value_map field in heatpipe ([#546](https://github.com/uber/fusionjs/pull/546))

## @uber/fusion-plugin-graphql-metrics
> *Changes since v1.0.4*

 - Improve error logging for wrapped errors ([#562](https://github.com/uber/fusionjs/pull/562))

## @uber/fusion-plugin-heatpipe
> *Changes since v3.0.8*

 - Log errors instead of throwing in heatpipe ([#443](https://github.com/uber/fusionjs/pull/443))
 - Ensure we await for heatpipe publish in try/catch block ([#576](https://github.com/uber/fusionjs/pull/576))

## @uber/fusion-plugin-s3-asset-proxying
> *Changes since v2.0.7*

 - Upload assets to both S3 and TerraBlob ([#561](https://github.com/uber/fusionjs/pull/561))

## fusion-plugin-apollo
> *Changes since v3.1.0*

 - Add support for default options config ([#566](https://github.com/uber/fusionjs/pull/566))

## fusion-plugin-i18n
> *Changes since v2.3.2*

 - Ensure translation keys are an array ([#579](https://github.com/uber/fusionjs/pull/579))

## jazelle
> *Changes since v0.0.0-alpha.3*

 - Fix symlink installation in `batch` command ([#559](https://github.com/uber/fusionjs/pull/559))
 - Ensure aliased packages compare correctly without throwing errors ([#543](https://github.com/uber/fusionjs/pull/543))
 - Make change detection track the `workspace` field in manifest.json rather than --type arg of jazelle changes ([#563](https://github.com/uber/fusionjs/pull/563))
 - Do defend against cases where the repo is in a dirty state ([#564](https://github.com/uber/fusionjs/pull/564))
 - Avoid infinite symlink chain ([#565](https://github.com/uber/fusionjs/pull/565))
 - Avoid hanging on error ([#568](https://github.com/uber/fusionjs/pull/568))
 - Log test errors ([#569](https://github.com/uber/fusionjs/pull/569))
 - Kill failed workers ([#570](https://github.com/uber/fusionjs/pull/570))
 - Expose errors if bazel query fails ([#573](https://github.com/uber/fusionjs/pull/573))
 - Fix symlink ([#571](https://github.com/uber/fusionjs/pull/571))
 - Rename greenkeep to upgrade ([#580](https://github.com/uber/fusionjs/pull/580))
 - Log out node, yarn, jazelle info on failed install ([#584](https://github.com/uber/fusionjs/pull/584))
 - Change `jazelle upgrade [name] --version [version]` to `jazelle upgrade [name@version]` ([#582](https://github.com/uber/fusionjs/pull/582))
 - Add node_modules to bazelignore ([#586](https://github.com/uber/fusionjs/pull/586))

---

## Documentation updates

#### @uber/fusion-plugin-flipr

- Specify it only works on the server ([#585](https://github.com/uber/fusionjs/pull/585))

#### fusion-react

- Fix doc for `defer` option in `split` ([#583](https://github.com/uber/fusionjs/pull/583))

## Packages published with only dependency upgrades

<details>
<summary>Expand packages</summary>

####  @uber/fusion-plugin-bedrock-compat

> _Changes since v2.0.8_

- Upgraded @uber/fusion-plugin-flipr dependency

####  @uber/fusion-plugin-feature-toggles-react

> _Changes since v3.0.8_

- Upgraded fusion-react dependency

####  @uber/fusion-plugin-google-analytics-react

> _Changes since v2.0.7_

- Upgraded fusion-react dependency

####  @uber/fusion-plugin-graphql-logging-middleware

> _Changes since v1.0.6_

- Upgraded fusion-plugin-apollo dependency

####  @uber/fusion-plugin-logtron-react

> _Changes since v2.1.5_

- Upgraded fusion-react dependency

####  @uber/fusion-plugin-m3-react

> _Changes since v2.0.8_

- Upgraded fusion-react dependency

####  @uber/fusion-plugin-marketing

> _Changes since v2.0.8_

- Upgraded @uber/fusion-plugin-heatpipe dependency

####  @uber/fusion-plugin-tealium-react

> _Changes since v2.0.7_

- Upgraded fusion-react dependency

####  @uber/fusion-plugin-web-rpc-compat

> _Changes since v1.0.8_

- Upgraded fusion-plugin-rpc dependency

####  fusion-plugin-font-loader-react

> _Changes since v2.0.6_

- Upgraded fusion-react dependency

####  fusion-plugin-i18n-react

> _Changes since v3.0.5_

- Upgraded fusion-plugin-i18n dependency
- Upgraded fusion-react dependency

####  fusion-plugin-rpc

> _Changes since v3.3.0_

- Upgraded fusion-plugin-i18n dependency

####  fusion-plugin-rpc-redux-react

> _Changes since v4.0.5_

- Upgraded fusion-plugin-rpc dependency
- Upgraded fusion-react dependency

####  fusion-plugin-universal-events-react

> _Changes since v2.1.5_

- Upgraded fusion-react dependency

</details>
