## @uber/fusion-plugin-rosetta
> *Changes since v2.4.1*

 - Upgrade node-rosetta (2.0.0) to replace Artifactory with Terrablob (#986)

## fusion-cli
> *Changes since v2.9.0*

 - Add logic to respect NODE_PRESERVE_SYMLINKS environment variable (#994)
 - Include latest mobile embedded browsers in modern bundle (#971)
 - Add support for importing YAML files as JSON (#992)
 - Upgrade to core-js@^3.3.0 to fix Android 4.4 compatibility (#723)

## @uber/create-uber-web
> *Changes since v5.1.3*

 - Update baseui to v9.69.0 (#957)
 - Fix monorepo folder path for new services (#958)
 - Remove galileo registration from scaffolds (#984)
 - Add ubook package to website templates (#973)
 - Remove snapshot tests from scaffold templates (#999)

## @uber/fusion-plugin-logtron
> *Changes since v3.1.0*

- Staging errors now logged on dedicated healthline page
- README fixes
 - Update with v3.x.x changes (#963)
 - Preserve message when logging to healthline and Update logger README (#980)
 - Use dedicated Healthline service for staging (#988)
 - Address healthline mapping for `with-map` suffix case (#993)

## @uber/fusion-plugin-marketing
> *Changes since v2.2.0*

 - Migrate to heatpipe `asyncPublish` to remove warning [marketing plugin] (#848)

## fusion-plugin-universal-events
> *Changes since v2.1.2*

 - Update flush logic for universal events plugin (#969)

## jazelle
> *Changes since v0.0.0-alpha.13*

 - Copy generated assets back to source folder (and fix dependent builds) (#952)
 - Fix performance of add command (#960)
 - Make jazelle changes faster (#961)
 - Guard against non-numeric versions (#966)
 - Support multiple deps in jazelle remove (#964)
 - Sort package.json keys when writing to disk (#970)
 - Throw better error if adding non-existent package (#968)
 - Fix issue with not catching failures (#972)
 - Remove preserve symlinks environment variable set (#974)
 - Fix issue with sorting packages and arrays (#975)
 - Fix sorting nested lists in package.json (#977)
 - Add caching and global registry config for jazelle dedupe command (#990)
 - Add preserve_symlinks attr into bazel rules (#1002)
