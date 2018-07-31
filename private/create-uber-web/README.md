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
    -h, --help       Displays this message
```

### Scaffolding into a monorepo

If you use a Lerna monorepo or Yarn workspaces, simply run the `yarn create @uber/uber-web scaffold` command from the directory where you want the project folder to be created.
