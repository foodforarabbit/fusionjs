# @uber/create-uber-web

A tool to manage web project boilerplates.

At Uber, the Web Platform team provides boilerplates for websites, libraries and React components. These boilerplates come preconfigured with recommended tooling such as babel, eslint, flow and prettier.

The `npx @uber/create-uber-web scaffold` command creates boilerplate templates
The `npx @uber/create-uber-web provision` command sets up your project for publishing.

```
npx @uber/create-uber-web <command> [options]
# or
yarn create @uber/uber-web <command> [options]

  Usage
    $ npx @uber/create-uber-web uber-web <command> [options]

  Available Commands
    scaffold     Scaffold a new project structure locally
    provision    Publish a web application

  For more info, run any command with the `--help` flag
    $ uber-web scaffold --help
    $ uber-web provision --help

  Options
    -v, --version    Displays current version
    -h, --help       Displays help message
```

Note that the scaffold wizard will ask you for your team name. If you don't know what it is, ask your manager.

### Scaffolding into a monorepo

If you use a Lerna monorepo or Yarn workspaces, simply run `yarn create @uber/uber-web scaffold` from the directory where you want the project folder to be created.

If you are scaffolding into a versionless monorepo (i.e. a monorepo that has a global yarn.lock file, as opposed to one where each package is versioned and published individually), run `yarn create @uber/uber-web scaffold --hoist-deps` from the directory where you want the project folder to be created. The `--hoist-deps` flag generates a scaffold without `dependencies`, `devDependencies` and `peerDependencies` in its `package.json` file.

---

### Setting up a repository

```
# in your project root folder
git init
git checkout -b master
git remote add origin gitolite@code.uber.internal:{YOUR_TEAM_NAME}/{YOUR_PROJECT_NAME}
git add README.md
git commit -m 'initial commit'
git push origin master # At Uber, git push is only used to create the repo. To push further changes, use arc diff
```

---

### Setting up CI

Ensure you can find your repository in Phab (search for `r {YOUR_TEAM_NAME}/{YOUR_PROJECT_NAME}`).

Create a Jenkins job via [auto-make-jenkins-job](https://ci.uberinternal.com/job/auto-make-jenkins-job/build?delay=0sec)

```
REPO_URL: gitolite@code.uber.internal:{YOUR_TEAM_NAME}/{YOUR_PROJECT_NAME}
JOB_TEMPLATE: WebsiteTest
LABEL_EXPRESSION: cloud-jessie-docker
JOB_NAME: test-{YOUR_TEAM}-{YOUR_PROJECT_NAME}
```

It will take a few minutes to create the job (see the blinking red circle on the left bottom panel of the Jenkins UI for progress).

Once the job is complete, you will be able to find your job by searching for it or via `https://ci.uberinternal.com/job/test-{YOUR_TEAM}-{YOUR_PROJECT_NAME}`

You can now commit your code:

```
git checkout -b initial-code
git add .
git commit -m 'initial code push'
arc diff
```

Go to your project's Phab page and verify that the Jenkins job named `test-{YOUR_TEAM}-{YOUR_PROJECT_NAME}` triggered and passed. If not, try waiting a few minutes, commit a documentation change and diff again.

---

### Publishing libraries, components and plugins to UNPM

uNPM is Uber's internal NPM registry. Do not publish to the public NPM/Yarn registries if your project is not intended to be open-sourced or has not gone through Open Source Legal review.

You can publish internal libraries, React components and Fusion plugins to uNPM, but you should not publish web apps to it. To enable uNPM publishing, ensure you have an empty file called `.uber/publish` at the root of your project. Appropriate scaffolds should already come with the the file.

To trigger a publish, update the version field in your project's package.json and commit it.

```
npm version {NEW_VERSION} # or `npm version patch` or `npm version minor` etc
git checkout -b {NEW_VERSION}
git commit -m '{NEW_VERSION}'
git push origin {NEW_VERSION}
```

Publishing may take a few minutes to reflect in unpm.uberinternal.com due to caching, but should appear immediately in unpmsearch.uberinternal.com.

Technical Details: Publishing happens via herald rule [500](https://code.uberinternal.com/herald/rule/500/) which calls harbormaster plan [162](https://code.uberinternal.com/harbormaster/plan/162/) which in turn calls Jenkins job [unpm-publish](https://ci.uberinternal.com/job/unpm-publish/)

---

### Provisioning web apps

See the [provisioning guide](https://docs.google.com/document/d/1j2XVa4fiM4xtss_WgwQWh0-HVwpvEbBcHb_R61dIl3U/edit#)

---

### Troubleshooting

#### Package could not be found in registry

If you get an error saying that @uber/uber-web is not in `https://registry.yarnpkg.com`, run this command:

```
yarn config set registry "https://unpm.uberinternal.com"
```

If the issue persists, run `npx @uber/create-uber-web scaffold` instead of `yarn create @uber/uber-web scaffold`. If both fail, run `yarn global add @uber/create-uber-web && create-uber-web scaffold`.

#### Illegal operation on a directory (EISDIR)

Try `yarn create @uber/uber-web scaffold` instead of `npx @uber/create-uber-web scaffold`.

If you get an `illegal operation on a directory` error running the `npx` command, make sure your home directory name only contain lowercase alphanumeric characters (i.e. no spaces and no symbols).

Check that your `.npmrc` file does not have a truncated file path for the `prefix` option.

If all else fails, run `yarn global add @uber/create-uber-web && create-uber-web scaffold`.

#### Syntax errors

If you get syntax errors, it's likely because you're using non-standard syntax such as class properties or decorators. Note that while you can add the babel presets/plugins yourself, the Web Platform team does not recommend using them and does not support non-standard syntax extensions other than JSX and Flow.

#### Flow errors

If you get errors about missing types, find the type definitions for the libraries you're using in flow-typed

```
yarn global add flow-typed
flow-typed install the-library@x.x.x
```

If a libdef does not exist, consider creating one with `flow-typed create-stub the-librar@x.x.x` and submitting it to flow-typed.

#### Publish errors

If you tried to run `npm publish`, don't. Follow the UNPM publishing instructions above.

If the `unpm-publish` Jenkins job fails, try pinning the versions in the `engines` field in package.json. If this does not work, try to re-publish (this is due to a long standing networking timeout issue related to UNPM).
