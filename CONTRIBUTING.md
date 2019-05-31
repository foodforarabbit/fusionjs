# Contributing to fusionjs

**Before continuing, make sure you've read the Rush [Getting Started as a Developer](https://rushjs.io/pages/developer/new_developer/) guide**.

This repo is maintained using [rushjs](https://rushjs.io). This doc will detail the commands needed to perform various tasks, but it's also helpful to read through the Rush [command docs](https://rushjs.io/pages/commands/rush_add/) as well.

---

### Table of contents

- [Design decisions](#design-decisions)
- [Authoring changes](#authoring-changes)
- [Dependencies](#dependencies)
  - [Install](#install)
  - [Add new](#add-new)
  - [Upgrade](#upgrade)
  - [node_modules/yarn.lock](#node_modulesyarnlock)
- [Workflow](#workflow)
- [Releasing changes](#releasing-changes)
  - [Canary releases](#canary-releases)
  - [Releases](#releases)

---


## Design decisions
<sup><a href="#table-of-contents">Back to top</a></sup>

#### Problem

How can we keep our open source codebase independent for external contributors, but still part of our larger, private codebase so we can easily develop, test, and release changes throughout the entire codebase without worrying about anything being out of sync?

#### Solution

A private "parent" monorepo ([uber/fusionjs](https://github.com/uber/fusionjs)) and a public "child" subset monorepo ([fusionjs/fusionjs](https://github.com/fusionjs/fusionjs)) that is able to operate independently. To achieve this, we use [a probot app](https://github.com/uber-workflow/probot-app-monorepo-sync) to keep the two in sync whenever a change is pushed to them

## Authoring changes
<sup><a href="#table-of-contents">Back to top</a></sup>

#### Where do I make my changes?

If you're making changes to the open source codebase, do it in the open source monorepo. It may be tempting to exclusively work in the parent monorepo, but doing so hides valuable information from external contributors. It's important that all contributors are able to trace a change back to its pull request or issue; making all our changes privately inhibits that

#### But shouldn't open source changes be tested against the entire codebase while they're being reviewed?

Yes. Not only are code pushes synced between the repos, but pull requests are as well. When a pull request is opened in the open source repo, the bot opens a supplementary pull request using the same source and target branch names in the parent monorepo and pulls your changes into it.

This achieves two things; it:
1. triggers CI in the parent repo so e2e tests are run against the new changes, and
2. provides a place to make supplementary changes if something in the private codebase breaks as a result of an open source change

#### How do I go about merging when there's two separate PRs for my change?

Along with the usual Github status checks you'll see for the CI validating your changes, you'll also notice one indicating the status of the parent monorepo CI. Assuming all CI is successful, go ahead and merge like you normally would; the bot will take care of merging the other PR

#### What if I want to close my PR without merging?

Just close it. The bot will close the other PR for you. Make sure you delete the branch if you're done with it (the bot will also do the same in the other PR)

#### What if I accidentally make open source changes from the private monorepo?

It's not the end of the world. The bot will sync them into the open source monorepo; it will just use generic, non-descriptive commit messages


## Dependencies
<sup><a href="#table-of-contents">Back to top</a></sup>

**NOTE**: Rush uses its own binary for yarn (version specified in `rush.json` > `yarnVersion`), so the only version you should need to worry about is node (configured in `rush.json` > `nodeSupportedVersionRange`)

#### Install

Equivalent: `yarn install`

See: [rush install](https://rushjs.io/pages/commands/rush_install/), [rush build](https://rushjs.io/pages/commands/rush_build/)

```sh
rush install && rush build
```

#### Add new

Equivalent: `yarn add lodash`

See: [rush add](https://rushjs.io/pages/commands/rush_add/)

```sh
# --caret: prepend with ^
# -m: update other packages with this dep
rush add --caret -m -p lodash
```

#### Upgrade

Equivalent: `yarn upgrade`

See: [rush update](https://rushjs.io/pages/commands/rush_update/)

```sh
rush update
```

#### node_modules/yarn.lock

Instead of `yarn.lock` being in the repository root or in individual packages, there now is a single, Rush-managed lockfile at `common/config/rush/yarn.lock`; and similarly, `common/temp/node_modules` is where all dependencies are installed and symlinked from in each package.


## Workflow
<sup><a href="#table-of-contents">Back to top</a></sup>

For linting, testing, and type checking individual packages, there isn't much of a difference. Each package still has its own `flow`, `lint` and `test` scripts, so running `yarn test`, for example, still works as expected.


## Releasing changes
<sup><a href="#table-of-contents">Back to top</a></sup>

#### Canary releases

1. Click commit status icon (checkmark on commit list view)
2. Click "Details" on check run named "Release"
3. Click ":baby_chick: Canary release" button on check run details page

This will create a GitHub Deployment, which in turn triggers a https://buildkite.com/uber/fusionjs-publish job, which publishes a canary version for all packages. If the monorepo git hash is abc123, each package will have version 0.0.0-canary.abc123.0.

#### Releases

1. On master branch, click "Details" on commit check run named "Release"
2. Click ":rocket: Release PR" button on check run details page
  a. Note: The "Package tarball hashes" status must be set
3. Open automatically created release PR
4. Edit .release.toml with new versions for changed/new packages
5. Edit .release-notes.md
6. Merge PR after review + approval

