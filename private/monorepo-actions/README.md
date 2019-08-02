# monorepo-actions

### get-package-release

Maps a fusion package version to a release tag

```sh
> node get-package-release.js @uber/fusion-plugin-heatpipe 3.0.4
> releases/2019-07-03/222006/restless-lake
```

```sh
> node get-package-release.js @uber/fusion-plugin-heatpipe 3.0.3
> releases/2019-06-18/003840/fierce-poetry
```

```sh
> node get-package-release.js @uber/fusion-plugin-heatpipe latest
> releases/2019-07-03/222006/restless-lake
```

Get all commits to @uber/fusion-plugin-heatpipe between the latest release and master

```sh
git log --oneline \
$(node get-package-release.js @uber/fusion-plugin-heatpipe latest)..master \
../../private/fusion-plugin-heatpipe
```

Get a birds-eye view of changes to @uber/create-uber-web since v3.0.0

```sh
git diff --compact-summary \
$(node get-package-release.js @uber/create-uber-web 3.0.0) \ 
../../private/create-uber-web
```
