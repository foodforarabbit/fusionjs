# uber/fusionjs

> The entire fusionjs codebase, including the [open source fusionjs monorepo](https://github.com/fusionjs/fusionjs) synced into the `public` directory

### Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Fusion.js Monorepo Runbook](https://docs.google.com/document/d/1gvmU9Q2HUe0HTdfOQAVZoJyiDTa4uVF-9te1v21P3AI) before developing in the fusionjs codebase

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

Secrets are stored here: [https://s3.console.aws.amazon.com/s3/buckets/buildkite-private-managedsecretsbucket-001/fusion-monorepo/?region=us-west-1&tab=overview](https://s3.console.aws.amazon.com/s3/buckets/buildkite-private-managedsecretsbucket-001/fusion-monorepo/?region=us-west-1&tab=overview), in the `env` file.

Buildkite Agents run on two different AWS CloudFormation stacks (in the US East - Ohio region).

The pipeline step is run on [`buildkite-private-builders`](https://us-east-2.console.aws.amazon.com/cloudformation/home?region=us-east-2#/stack/detail?stackId=arn:aws:cloudformation:us-east-2:027047743804:stack%2Fbuildkite-private-builders%2F939ea260-4509-11e9-802f-069569a529ae). The test/lint/flow jobs are run on [`build-private-default`](https://us-east-2.console.aws.amazon.com/cloudformation/home?region=us-east-2#/stack/detail?stackId=arn:aws:cloudformation:us-east-2:027047743804:stack%2Fbuildkite-private-default%2F65a2e370-5479-11e8-9e22-50a686f309d1)

