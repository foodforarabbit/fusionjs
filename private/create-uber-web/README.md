# @uber/create-uber-web

A tool to manage web project boilerplates.

At Uber, the Web Platform team provides boilerplates for websites, libraries and React components. These boilerplates come preconfigured with recommended tooling such as babel, eslint, flow and prettier.

The `yarn create @uber/uber-web scaffold` command creates boilerplate templates
The `yarn create @uber/uber-web provision` command sets up your project for publishing.

```
yarn create @uber/uber-web <command> [options]

Usage
    $ uber-web <command> [options]

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

### Scaffolding into a monorepo

If you use a Lerna monorepo or Yarn workspaces, simply run `yarn create @uber/uber-web scaffold` from the directory where you want the project folder to be created.

If you are scaffolding into a versionless monorepo (i.e. a monorepo that has a global yarn.lock file, as opposed to one where each package is versioned and published individually), run `yarn create @uber/uber-web scaffold --hoist-deps` from the directory where you want the project folder to be created. The `--hoist-deps` flag generates a scaffold without `dependencies`, `devDependencies` and `peerDependencies` in its `package.json` file.
