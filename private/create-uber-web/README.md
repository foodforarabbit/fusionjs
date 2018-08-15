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

### Scaffolding into a monorepo

If you use a Lerna monorepo or Yarn workspaces, simply run `yarn create @uber/uber-web scaffold` from the directory where you want the project folder to be created.

If you are scaffolding into a versionless monorepo (i.e. a monorepo that has a global yarn.lock file, as opposed to one where each package is versioned and published individually), run `yarn create @uber/uber-web scaffold --hoist-deps` from the directory where you want the project folder to be created. The `--hoist-deps` flag generates a scaffold without `dependencies`, `devDependencies` and `peerDependencies` in its `package.json` file.

---

### Troubleshooting

If you get an error saying that @uber/uber-web is not in `https://registry.yarnpkg.com`, run this command:

```
yarn config set registry "https://unpm.uberinternal.com"
```
