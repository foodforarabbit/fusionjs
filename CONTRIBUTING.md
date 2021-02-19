# Contributing to Fusion.js

This repo is maintained using [Yarn v2](https://github.com/yarnpkg/berry). This doc will detail the commands needed to perform various tasks, but it's also helpful to read through the [Yarn v2 Documentation](https://yarnpkg.com/getting-started) as well.

---

### Table of contents

- [Quick start](#quick-start)
- [Design decisions](#design-decisions)
- [Authoring changes](#authoring-changes)
- [Dependencies](#dependencies)
  - [yarn.lock](#yarnlock)
- [Workflow](#workflow)
- [Releasing changes](#releasing-changes)
  - [Canary releases](#canary-releases)
  - [Releases](#releases)

---


## Quick start
<sup><a href="#table-of-contents">Back to top</a></sup>

#### 1. Install Jazelle


```sh
npm install --global jazelle
```

#### 2. Take it for a spin

```sh
yarn install
cd some/package/path
yarn workspaces foreach run prepack
yarn test
```

## Design decisions
<sup><a href="#table-of-contents">Back to top</a></sup>

#### Problem

How can we keep our open source codebase independent for external contributors, but still part of our larger, private codebase so we can easily develop, test, and release changes throughout the entire codebase without worrying about anything being out of sync?

#### Solution

A private "parent" monorepo ([uber/fusionjs](https://github.com/uber/fusionjs)) and a public "child" subset monorepo ([fusionjs/fusionjs](https://github.com/fusionjs/fusionjs)) that is able to operate independently. To achieve this, we use [probot-app-usync](https://github.com/uber-workflow/probot-app-usync) to enforce a workflow that keeps the two repos in sync.

## Authoring changes
<sup><a href="#table-of-contents">Back to top</a></sup>

To help understand our authoring workflow, it's worth looking over the [RFC](https://docs.google.com/document/d/1WUza9Be3lxrRi5TZY7mX7aEoEqEonKlhtpxxinmQv5I) and the probot's [docs](https://github.com/uber-workflow/probot-app-usync#comment-commands) on using commands.

#### Private *and* public monorepo? Where do I make my changes?

If you have access to the private monorepo (this repo), it's easiest to author changes here; however they can also be authored from [the public monorepo](https://github.com/fusionjs/fusionjs).

#### How do I author a change?

The actual authoring of your change doesn't really involve our sync workflow, so you can do this how you normally would with any GitHub repo. The sync workflow only comes into play when you're ready to land your change.

#### Okay, so how do I land my change?

If you're in the public monorepo, comment `!import` on the pull request to import the change into a new PR in the private monorepo. The change can then be validated against CI for the entire codebase.

If you're in the private monorepo, comment `!land`, and it'll land the change in all applicable repos.

**DO NOT manually use the GitHub merge button**. This will result in a lopsided change in only one of the monorepos. If you can't possibly stop yourself, install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) for Chrome and visit [this userscript](https://gist.github.com/chrisdothtml/a56cff0ab51bdbccea49d1236b741e94/raw/HideMergeButton.user.js) (should prompt you to install) to hide the merge button.

#### Regarding fusion-cli features and compiler magic

We aim to match as closely as possible the syntax and semantics of vanilla JS.

Any new compiler features or syntax/semantics that deviate from vanilla JS should meet all of the following criteria:

1. Is able to be *trivially* codemodded to vanilla JS
2. Have a long history of stability without breaking changes (and ideally an mature, established specification)
3. Have zero configuration options

JSX is a fairly good example of something meeting these criteria.

## Dependencies
<sup><a href="#table-of-contents">Back to top</a></sup>

#### yarn.lock

Yarn v2 manages dependencies with a top-level `yarn.lock` and `.yarn/cache` directory. Make sure to commit any changes made into the repository.

## Workflow
<sup><a href="#table-of-contents">Back to top</a></sup>

For linting, testing, and type checking individual packages, use the equivalent jazelle commands e.g. `jazelle flow`, `jazelle lint`, and `jazelle test`.

## Releasing changes
<sup><a href="#table-of-contents">Back to top</a></sup>

#### Canary releases

1. Click commit status icon (checkmark on commit list view)
2. Wait for "Package tarball hashes" status to appear.
3. Click "Details" on check run named "Release"
4. Click <kbd>:baby_chick: Canary release</kbd> button on check run details page

This will create a GitHub Deployment, which in turn triggers a https://buildkite.com/uber/fusionjs-publish job, which publishes a canary version for all packages. If the monorepo git hash is abc123, each package will have version 0.0.0-canary.abc123.0.

#### Releases

1. On master branch, click "Details" on commit check run named "Release"
    - This is accessible from the commit list view via the modal that appears when clicking the green check mark
2. Click <kbd>:rocket: Release PR</kbd> button on check run details page
    - *Note: The "Package tarball hashes" status must be present on the HEAD commit of master before this will work*
3. Open the automatically created release PR
4. Edit the generated `.release-notes.md` with changes for each package
    - Each changed package will have automatically scaffolded notes based on commits
    - Use GitHub review suggestions to propose and discuss changes and then batch commit them from the UI
    - This should be a group effort and the folks most knowledgable with particular changes should help craft quality release notes for them
    - Release notes are not limited to bullet points: arbitrary markdown is supported (e.g. code snippets, code diffs, etc.)
    - **Important: Unlike commit messages, release notes have a primarily external, non-maintainer audience (i.e. consumers of these packages), so notes should be tailored accordingly**
5. Edit the generated `.release.toml` with new versions for changed/new packages
6. Cut a canary release from release PR (using steps above)
7. Upgrade `example-trips-viewer-fusion` with the canary release
8. Merge PR after final review and approval
