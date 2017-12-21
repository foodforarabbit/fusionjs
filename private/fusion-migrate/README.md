# fusion-migrate

This tool runs migration scripts for old versions of FusionJS APIs to the latest version. These migrations are meant to be run on apps scaffolded from `uber-web scaffold` using the `@uber/uber-web-template-fusion-website` template, and on FusionJS plugin repos.

### How to run migrations

Note: running migrations will modify source code in-place. Make sure you have no uncommitted changes before running them.

```sh
# from the root directory of your project/plugin repo
yarn add @uber/fusion-migrate
yarn fusion-migrate
```

### What to do if migration doesn't work

If you ignored [these](https://engdocs.uberinternal.com/graphenejs-docs/docs/getting-started/project-structure#srcmainjs) [warnings](https://code.uberinternal.com/diffusion/WEUBELI/browse/master/content/src/main.js;4a5fb0c2333db695cb32cb776314256fc9da6ef1$2), you will need to take manual steps in order to fully migrate correctly.

Reach out to the Web platform team on the [FusionJS uChat](https://uchat.uberinternal.com/uber/channels/fusion-js) if you need help.
