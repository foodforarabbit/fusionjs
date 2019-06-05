// @flow

import {createPlugin, type Context} from 'fusion-core';
import type {GraphQLResolveInfo} from 'graphql';
import type {PluginServiceType, DepsType} from './types.js';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import {applyMiddleware} from 'graphql-middleware';
import {snakeCase} from './snakecase';

const enhancer = (schema: any) =>
  createPlugin<DepsType, PluginServiceType>({
    deps: {
      logger: LoggerToken,
      m3: M3Token,
      tracer: TracerToken.optional,
    },
    provides({logger, m3}) {
      const middleware = async (
        resolve,
        root,
        args,
        context: Context,
        info: GraphQLResolveInfo
      ) => {
        const {parentType} = info;
        const shouldLog =
          parentType.name === 'Query' ||
          parentType.name === 'Mutation' ||
          parentType.name === 'Subscription';

        if (!shouldLog) {
          return resolve(root, args, context, info);
        }
        const operationType = info.operation.operation;
        const operationName =
          (info.operation.name && info.operation.name.value) || 'anonymous';
        const startTime = Date.now();
        const tags = {
          operation_type: snakeCase(operationType),
          operation_name: snakeCase(operationName),
          result: 'success',
        };
        try {
          const result = await resolve(root, args, context, info);
          m3.timing('graphql_operation', startTime, tags);
          return result;
        } catch (e) {
          tags.result = 'failure';
          m3.timing('graphql_operation', startTime, tags);
          logger.error(`${operationName} ${operationType} failed`, e);
          throw e;
        }
      };
      return applyMiddleware(schema, middleware);
    },
  });

export default enhancer;
