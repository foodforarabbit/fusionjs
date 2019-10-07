// @flow

import {type GraphQLResolveInfo} from 'graphql';
import {createPlugin, type Context} from 'fusion-core';
import type {PluginServiceType, DepsType} from './types.js';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken, type Span} from '@uber/fusion-plugin-tracer';
import {snakeCase} from './snakecase';
import {ApolloLink} from 'apollo-link';
import * as opentracing from 'opentracing';
import compare from 'just-compare';

const container = Symbol('container');

function getSpanList(ctx: Context, operationName: string): Array<[Span, any]> {
  const rootMap: Map<string, Array<[Span, any]>> =
    ctx.memoized.get(container) || new Map();
  ctx.memoized.set(container, rootMap);
  const spanTuples: Array<[Span, any]> = rootMap.get(operationName) || [];
  rootMap.set(operationName, spanTuples);
  return spanTuples;
}

const plugin = createPlugin<DepsType, PluginServiceType>({
  deps: {
    logger: LoggerToken,
    m3: M3Token,
    Tracer: TracerToken.optional,
  },
  provides({logger, m3, Tracer}) {
    return (links, ctx) => {
      if (Tracer) {
        // This is a private API which is necessary for correct tracing hierarchy. This will be used by atreyu generated code.
        // We may be able to remove this API in favor of a cleaner solution if we move away from graphql-tools and apollo-server
        // in favor of custom tools.
        ctx._getSpanContextFromInfo = (info: GraphQLResolveInfo) => {
          const operationName =
            (info.operation.name && info.operation.name.value) || 'anonymous';
          const spans = getSpanList(ctx, operationName);
          const infoVariables = (info.operation.variableDefinitions || []).map(
            def => {
              return info.variableValues[def.variable.name.value];
            }
          );
          if (spans.length === 1) {
            return spans[0][0];
          }
          // eslint-disable-next-line no-unused-vars
          const [span] =
            spans.find(([span, variables]) => {
              const isEqual = compare(variables, infoVariables);
              return isEqual;
            }) || [];
          if (!span) {
            logger.warn(
              `Could not find parent span for query: ${operationName}`
            );
            return Tracer.from(ctx).span.context();
          }
          return span.context();
        };
      } else {
        ctx._getSpanContextFromInfo = () => {
          throw new Error(
            'This feature requires the Tracer to be enabled. Ensure the TracerPlugin is registered on the TracerToken'
          );
        };
      }
      return [
        new ApolloLink((op, forward) => {
          const operationDefinition = op.query.definitions
            .filter(def => def.kind === 'OperationDefinition')
            .find(def => def.name && def.name.value === op.operationName);
          if (!operationDefinition) {
            logger.warn('Could not find operation for ' + op.toKey());
            return forward(op);
          }
          const variables = operationDefinition.variableDefinitions.map(def => {
            return op.variables[def.variable.name.value];
          });
          const {operationName} = op;
          const operationType = operationDefinition.operation;
          const start = new Date();
          const tags = {
            operation_type: snakeCase(operationType),
            operation_name: snakeCase(operationName),
            result: 'success',
          };
          const spanTuples = getSpanList(ctx, operationName);
          let span;

          if (Tracer) {
            const tracer = Tracer.from(ctx);
            span = tracer.tracer.startSpan(
              `graphql.${operationType}.${operationName}`,
              {
                childOf: tracer.span.context(),
                tags: {
                  operationType,
                  [opentracing.Tags.COMPONENT]: 'graphql',
                },
              }
            );
            spanTuples.push([span, variables]);
          }
          const observer = forward(op);

          return observer.map(result => {
            const {errors} = result;
            const message = `${operationName} ${operationType} failed`;
            if (errors) {
              errors.forEach(e => {
                if (e.originalError && Array.isArray(e.originalError.errors)) {
                  e.originalError.errors.forEach(err => {
                    if (err.originalError) {
                      logger.error(message, err.originalError);
                    } else {
                      logger.error(message, err);
                    }
                  });
                } else {
                  logger.error(message, e);
                }
              });
              tags.result = 'failure';
            } else {
              tags.result = 'success';
            }
            if (span) {
              if (errors) {
                span.setTag(opentracing.Tags.ERROR, true);
              }
              span.finish();
            }
            m3.timing('graphql_operation', start, tags);
            return result;
          });
        }),
      ].concat(links);
    };
  },
});

export default plugin;
