## @uber/create-uber-web
> *Changes since v4.0.4*

 - Remove vestigial monorepo templates and supporting code ([#601](https://github.com/uber/fusionjs/pull/601))
 - Update scaffold `package.json` `engines` field ([#602](https://github.com/uber/fusionjs/pull/602))
 - Update `.graphqlconfig` to use `.graphql` file extension for `schemaPath` ([#611](https://github.com/uber/fusionjs/pull/611))
 - Persist user submitted input during provisioning so that if a service needs to run through provisioning again, saved input can be used instead of forcing the user to re-type everything ([#617](https://github.com/uber/fusionjs/pull/617))
 - Add codemod for updating schema path in graphqlconfig ([#612](https://github.com/uber/fusionjs/pull/612))
 - Fix GraphQL scaffold ([#618](https://github.com/uber/fusionjs/pull/618)) ([#631](https://github.com/uber/fusionjs/pull/631))
 - Remove web-analytics and flipr from scaffolds ([#616](https://github.com/uber/fusionjs/pull/616))
 - Lock `fusion-plugin-rosetta` version in scaffolds ([#627](https://github.com/uber/fusionjs/pull/627))
 - Add explanation on difference between public and external apps ([#625](https://github.com/uber/fusionjs/pull/625)) ([#621](https://github.com/uber/fusionjs/pull/621))
 - Use modern APIs in scaffolded React component code ([#626](https://github.com/uber/fusionjs/pull/626))

## @uber/fusion-plugin-rosetta
> *Changes since v2.2.0*

 - Change the rosetta fallback logic ([#600](https://github.com/uber/fusionjs/pull/600))
 - Update node-rosetta to 1.1.7 ([#614](https://github.com/uber/fusionjs/pull/614))

## @uber/fusion-plugin-web-rpc-compat
> *Changes since v1.0.9*

 - Ensure errors in the callback are not in the promise chain ([#619](https://github.com/uber/fusionjs/pull/619))
 - Update the error handling to namespace the error object to match previous behavior ([#620](https://github.com/uber/fusionjs/pull/620))

## fusion-cli
> *Changes since v2.4.2*

 - Remove compiler warning for custom Babel config ([#607](https://github.com/uber/fusionjs/pull/607))
 - Fix an issue that caused spurious `Bundle does not contain default export` errors ([#575](https://github.com/uber/fusionjs/pull/575))
 - Reduce noisy logs in build-time error output ([#551](https://github.com/uber/fusionjs/pull/551))
 - Prevent tilde characters from being used in generated bundle filenames for compatibility with TerraBlob ([#624](https://github.com/uber/fusionjs/pull/624))

## fusion-plugin-react-router
> *Changes since v2.0.8*

 - Export hooks from react-router-dom 5.1 ([#606](https://github.com/uber/fusionjs/pull/606))

## jazelle
> *Changes since v0.0.0-alpha.4*

 - Allow passing args to dev, lint, flow and start commands ([#596](https://github.com/uber/fusionjs/pull/596))
 - Upgrade jazelle dep versions ([#603](https://github.com/uber/fusionjs/pull/603))
 - Fix node SHA for mac ([#610](https://github.com/uber/fusionjs/pull/610))
 - Don't delete manually added targets from deps field if they are related but not exactly synchronizable targets ([#613](https://github.com/uber/fusionjs/pull/613))
 - Simplify flow rule ([#628](https://github.com/uber/fusionjs/pull/628))
 - Do flag all projects as changed if WORKSPACE file changes ([#632](https://github.com/uber/fusionjs/pull/632))

<details>
<summary>📦Packages published with only dependency upgrades</summary>

## @uber/fusion-plugin-graphql-metrics
> *Changes since v1.1.0*

 - Move `react` dependency to devDependency ([#630](https://github.com/uber/fusionjs/pull/630))

## fusion-plugin-connected-react-router
> *Changes since v2.0.8*

 - Upgraded fusion-plugin-react-router dependency
 
## fusion-plugin-service-worker
> *Changes since v3.0.21*

 - Upgraded fusion-cli dependency
 
</details>
