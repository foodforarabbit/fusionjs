# Contributing to create-uber-web

### Development

```
yarn dev
```

The `yarn dev` command starts a watcher for babel, eslint, jest and flow.

As a rule of thumb, the implementation for each command should be in a file named after the command in the `commands` folder. Each step implementation should be wrapped in an async function in the `utils` folder.

### Upgrading dependencies

To upgrade dependencies, run `./renovate.sh`

### Gotchas

Each template is a folder in in the `/templates` folder. The package.json file of each template supports nunjucks interpolations, but some fields are codemodded separately.

The `name` and `engines` fields must not contain nunjucks interpolations. They are read by yarn when running the [dependency upgrade script](#upgrading-dependencies).

There must not be a `files` field, otherwise the published create-uber-web package will be missing files in template folders. Templates must define publishing exclusions in a `__files` field instead, which is renamed to `files` during codemodding.
