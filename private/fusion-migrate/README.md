# fusion-migrate

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

Reach out to the Web platform team on the [Fusion.js uChat](https://uchat.uberinternal.com/uber/channels/fusion-js) if you need help.

---

### Upgrading

To upgrade, run:

```sh
yarn fusion-migrate upgrade
```
