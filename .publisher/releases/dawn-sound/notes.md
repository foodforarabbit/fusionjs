## @uber/fusion-plugin-events-adapter
> *Changes since v3.2.2*

 - Fix heatpipe payload for `pageview:browser` events (#1032)

## @uber/fusion-plugin-logtron
> *Changes since v3.1.2*

 - Don't assign props to meta when it is a string [Logger] (#1044)

## @uber/fusion-plugin-marketing
> *Changes since v2.2.2*

 - Add analytics session_id to marketing payload fusion-plugin-marketing (#1055)
 - Pass uclick_id query param to tracking payload in fusion-plugin-marketing (#1061)

## fusion-cli
> *Changes since v2.12.0*

 - Add line position to babel-plugin-i18n errors (#1052)

## fusion-plugin-react-redux
> *Changes since v2.1.3*

 - Add reduxDevtoolsConfig token to customize setup of Redux devtools extension (#1050)

## fusion-plugin-react-router
> *Changes since v2.2.4*

 - Emit constant if no matching route (#1056)
 - Mitigate export missing in flow def (#1062)

## jazelle
> *Changes since v0.0.0-alpha.16*

 - Make improvements to jazelle (#1045)
 - Add resolutions command (#1046)
 - Add support for single file dists in jazelle build rules (#1049)
 - Ignore .bazelignored files when computing `jazelle changes` (#1051)
 - Avoid unnecessary reinstalls for local upstream dependencies (#1057)
 - Implement gen_srcs option for web_executable and web_test rules (#1058)
 
 ## Packages published with only dependency upgrades
 
 - fusion-plugin-rpc-redux-react
 - fusion-plugin-service-worker
 - fusion-plugin-apollo
 - fusion-plugin-connected-react-router
 - fusion-plugin-font-loader-react
 - fusion-plugin-i18n-react
 - fusion-react 
 - @uber/fusion-plugin-graphql-logging-middleware
 - @uber/fusion-plugin-graphql-metrics
 - @uber/fusion-plugin-feature-toggles
 - @uber/fusion-plugin-feature-toggles-react
