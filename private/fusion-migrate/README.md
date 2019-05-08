# fusion-migrate

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Migration scripts for migrating from `@uber/bedrock` to Fusion.js, and upgrade scripts to get on the latest version of Fusion.js.

### How to run migrations

Note: running migrations will modify source code in-place. Make sure you have no uncommitted changes before running them.

```sh
# from the root directory of your project/plugin repo
yarn global add @uber/fusion-migrate
git checkout -b fusion-migrate
ufusion migrate
```

If your migration fails, run:

```sh
ufusion reset
ufusion migrate
```

### What to do if migration doesn't work

Projects vary wildly and therefore migrations can fail unexpectedly.

Reach out to the Web platform team on the [Fusion.js uChat](https://uchat.uberinternal.com/uber/channels/fusion-js) if you need help. We can pair with you to sort through issues.

To speed up the process, you may want to clone the [fusion-migrate repo](https://code.uberinternal.com/diffusion/WEFUSGK/) and run the migrations directly from there as we push fixes, instead of waiting for release cycles for fusion-migrate.

```
# from your repo
node ../fusion-migrate/bin/fusion-migrate reset
node ../fusion-migrate/bin/fusion-migrate migrate

# from maps monorepo
node ../../../fusion-migrate/bin/fusion-migrate reset
node ../../../fusion-migrate/bin/fusion-migrate migrate

```

---

### Upgrading

To upgrade, run:

```sh
yarn fusion-migrate upgrade
```
