// @flow

import {createPlugin} from 'fusion-core';
import type {PluginServiceType, DepsType} from './types.js';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import {snakeCase} from './snakecase';
import {ApolloLink} from 'apollo-link';

const plugin = createPlugin<DepsType, PluginServiceType>({
  deps: {
    logger: LoggerToken,
    m3: M3Token,
    tracer: TracerToken.optional,
  },
  provides({logger, m3}) {
    return (links, ctx) => {
      return [
        new ApolloLink((op, forward) => {
          const operationDefinition = op.query.definitions
            .filter(def => def.kind === 'OperationDefinition')
            .find(def => def.name && def.name.value === op.operationName);
          if (!operationDefinition) {
            logger.warn('Could not find operation for ' + op.toKey());
            return forward(op);
          }
          const {operationName} = op;
          const operationType = operationDefinition.operation;
          const start = Date.now();
          const tags = {
            operation_type: snakeCase(operationType),
            operation_name: snakeCase(operationName),
            result: 'success',
          };
          const observer = forward(op);
          // errors will be sent to the errorCallback
          observer.subscribe(({data, errors}) => {
            if (errors) {
              errors.forEach(e => {
                logger.error(`${operationName} ${operationType} failed`, e);
              });
              tags.result = 'failure';
            } else {
              tags.result = 'success';
            }
            m3.timing('graphql_operation', start, tags);
          });
          return observer;
        }),
      ].concat(links);
    };
  },
});

export default plugin;
