# Test private monorepo

This is a test for embedding a public (OSS) monorepo into a private monorepo via a git submodule and linking projects together via Rush.

### Things you can try

##### Clone this repo:

```sh
git clone git@github.com:uber/fusionjs.git
yarn git checkout monorepo # yes, yarn git, not just git
```

##### Bootstrap

```sh
rush update
rush build
```

##### Rebuild after changes

```
rush update
rush rebuild
```

Note: `rush build` will sometimes skip packages. Use `rebuild` instead.

##### Clean up local copy

```
rush purge
```

##### Run synchronized git commands via:

The [public repo](https://github.com/fusionjs/fusion-react/tree/monorepo) is a submodule of the private repo. By default, submodules don't stay in sync with the parent repo. In order to keep both in sync, use `yarn git` instead of just `git`.

```sh
yarn git [...]
```

Commiting everything would dirty the index since commiting to the submodule creates a change in the parent repo, so a convenience helper is provided for atomically committing all changes:

```
yarn commit -m "hello world"
```

This runs the same commands in the private repo and the [public repo](https://github.com/lhorie/test-public-monorepo) and ensures the submodule points to the correct commit at all times.

### Docker

```
docker system prune # ensure we don't run out of device space
docker-compose build --build-arg UNPM_TOKEN=[unpm _auth token from `~/.npmrc` goes here]
docker-compose run ci node install-run-rush test # test
docker-compose run ci node install-run-rush lint # lint
docker-compose run ci node install-run-rush flow # flow
```

### CI

CI is setup in buildkite. Ask keving@uber.com for an invite for the `uber` organization in Buildkite and the `WebPlatformInfrastructure` account in AWS. To login to AWS, use [https://aws.uberinternal.com](https://aws.uberinternal.com)

The CI pipeline is here: [https://buildkite.com/uber/fusion-monorepo](https://buildkite.com/uber/fusion-monorepo)

Secrets are stored here: [https://s3.console.aws.amazon.com/s3/buckets/buildkite-private-managedsecretsbucket-001/fusion-monorepo/?region=us-west-1&tab=overview](https://s3.console.aws.amazon.com/s3/buckets/buildkite-private-managedsecretsbucket-001/fusion-monorepo/?region=us-west-1&tab=overview), in the `env` file.

Buildkite Agents run on two different AWS CloudFormation stacks (in the US East - Ohio region).

The pipeline step is run on [`buildkite-private-builders`](https://us-east-2.console.aws.amazon.com/cloudformation/home?region=us-east-2#/stack/detail?stackId=arn:aws:cloudformation:us-east-2:027047743804:stack%2Fbuildkite-private-builders%2F939ea260-4509-11e9-802f-069569a529ae). The test/lint/flow jobs are run on [`build-private-default`](https://us-east-2.console.aws.amazon.com/cloudformation/home?region=us-east-2#/stack/detail?stackId=arn:aws:cloudformation:us-east-2:027047743804:stack%2Fbuildkite-private-default%2F65a2e370-5479-11e8-9e22-50a686f309d1)

