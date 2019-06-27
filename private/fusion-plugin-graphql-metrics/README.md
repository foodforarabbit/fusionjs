# @uber/fusion-plugin-graphql-metrics

A fusion plugin which provides a graphql plugin to handle logging, tracing, and metrics

### Table of contents

* [Installation](#installation)
* [Setup](#setup)
* [Logging](#logging)
* [Metrics](#metrics)
* [Tracing](#tracing)
* [API](#api)
  * [Dependencies](#dependencies)
    * [`LoggerToken`](#loggertoken)
    * [`M3Token`](#m3token)
    * [`TracerToken`](#tracertoken)
  * [Service API](#service-api)

### Installation 

```
yarn add @uber/fusion-plugin-graphql-metrics
```

### Setup

```js
import {GetApolloClientLinksToken} from 'fusion-plugin-apollo';
import GraphQLMetricsPlugin from '@uber/fusion-plugin-graphql-metrics';
app.register(GetApolloClientLinksToken, GraphQLMetricsPlugin);
```

### Logging

This plugin will log all resolver errors for any operation type (Query, Mutation, Subscription). The log will include the operation name, the operation type, and the associated error.

### Metrics

This plugin will log timing metrics for all root level resolver operations. It does not currently log individual timing metrics for nested resolvers, but this could be added in the future. The m3 timing events have the following tags

```
name: 'grapqhl_operation'
operation_name: 'snake_case_operation_name'
operation_type: 'query' | 'mutation' | 'subscription'
result: 'success' | 'failure'
```

### Tracing 

TODO

### API 

#### Dependencies

##### `LoggerToken`

```js
import {LoggerToken} from 'fusion-tokens';
```

Required - The canonical token for a logger. See [https://github.com/fusionjs/fusion-tokens#loggertoken](https://github.com/fusionjs/fusion-tokens#loggertoken)

##### `M3Token`

```js
import {M3Token} from '@uber/fusion-plugin-m3-react';
```

Required - The token for the M3 client which is used to report metrics. See [https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-m3-react](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-m3-react)

##### `TracerToken`

```js
import {TracerToken} from '@uber/fusion-plugin-tracer';
```

Required - The token for the tracer client which is used to report tracing. See [https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-tracer](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-tracer)
