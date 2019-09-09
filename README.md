# uber/fusionjs

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

> The entire Fusion.js codebase, including the [open source Fusion.js monorepo](https://github.com/fusionjs/fusionjs) synced into the `public` directory

### Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before developing in the Fusion.js codebase.

### CI

CI is setup in Buildkite. Ask keving@uber.com for an invite for the `uber` organization in Buildkite and the `WebPlatformInfrastructure` account in AWS. To login to AWS, use [https://aws.uberinternal.com](https://aws.uberinternal.com)

Secrets are stored here: [https://s3.console.aws.amazon.com/s3/buckets/buildkite-private-managedsecretsbucket-001/fusion-monorepo/?region=us-west-1&tab=overview](https://s3.console.aws.amazon.com/s3/buckets/buildkite-private-managedsecretsbucket-001/fusion-monorepo/?region=us-west-1&tab=overview), in the `env` file.

Buildkite Agents run on two different AWS CloudFormation stacks (in the US East - Ohio region).

The pipeline setup step is run on [`buildkite-private-builders`](https://us-east-2.console.aws.amazon.com/cloudformation/home?region=us-east-2#/stack/detail?stackId=arn:aws:cloudformation:us-east-2:027047743804:stack%2Fbuildkite-private-builders%2F939ea260-4509-11e9-802f-069569a529ae). The test/lint/flow jobs are run on [`build-private-default`](https://us-east-2.console.aws.amazon.com/cloudformation/home?region=us-east-2#/stack/detail?stackId=arn:aws:cloudformation:us-east-2:027047743804:stack%2Fbuildkite-private-default%2F65a2e370-5479-11e8-9e22-50a686f309d1)

#### Package Caching

As part of the pipeline setup, a dynamic Dockerfile is generated that will `yarn install` all dependencies needed by all packages in the monorepo. This setup is detailed in the following document: [https://docs.google.com/document/d/1KbQ64XLW7vwBC4L6zrclrpP2CQAQKDYEZ3j6cD9l65M/edit#heading=h.ielm68uc0kzr](https://docs.google.com/document/d/1KbQ64XLW7vwBC4L6zrclrpP2CQAQKDYEZ3j6cD9l65M/edit#heading=h.ielm68uc0kzr).

**TL;DR**: A [script](https://github.com/derekju/calculate-package-files) will generate all dependencies needed and output `package.json` files that will be installed. This install process utilizes docker layer caching to preload the Yarn cache as long as it has not changed. This image is then tagged and uploaded back to Amazon ECR.

#### Scope of Tests

CI runs tests for packages that have been directly modified as well as every downstream dependency of that package. Anything else is skipped to reduce the test time since if nothing upstream to the package has changed, there should be no reason to run tests for it. In practice, this will result in shorter test times for the vast majority of pull requests. Large refactors on the other hand will run more tests but those types of pull requests should be fewer.

Behind the scenes, the list of changes is calculated using [`jazelle changes`](https://github.com/fusionjs/fusionjs/tree/master/jazelle#jazelle-changes).
