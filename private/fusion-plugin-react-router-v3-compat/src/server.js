import React from 'react';
import {renderToString} from 'react-dom/server';
import {createToken, createPlugin} from 'fusion-core';
import {match as reactRouterMatch, RouterContext} from 'react-router';
import {LoggerToken} from 'fusion-tokens';

import StackTrace from '@uber/react-stack-trace';

const ReactRouterV3MatcherToken = createToken('ReactRouterV3MatcherToken');

// TODO: better default error components
function FourOhFour(props) {
  return __DEV__ ? (
    <StackTrace stack={props.error.stack || {}} />
  ) : (
    <div style={{border: '2px solid red'}}>Not Found</div>
  );
}

function Oops(props) {
  return __DEV__ ? (
    <StackTrace stack={props.error.stack || {}} />
  ) : (
    <div style={{border: '2px solid red'}}>Oops...Something is wrong</div>
  );
}

function asyncMatcher(...args) {
  return new Promise((resolve, reject) => {
    reactRouterMatch(...args, (matchError, redirectLocation, renderProps) => {
      return matchError
        ? reject(matchError)
        : resolve({redirectLocation, renderProps});
    });
  });
}

function handleError({err, ctx, logger, errorComponents}) {
  const status = err.status || err.statusCode || 500;
  const url = ctx.url;

  ctx.status = status;

  err.message = `[fusion-plugin-react-router-V3] ${err.message}`;
  logger.error(err.message, {err, url});

  const ErrorComponent =
    status === 404 ? errorComponents.notFound : errorComponents.fatal;

  ctx.element = null;
  ctx.body = renderToString(<ErrorComponent error={err} />);
}

export default createPlugin({
  deps: {
    matcher: ReactRouterV3MatcherToken.optional,
    logger: LoggerToken,
    // TODO: errorComponents
  },
  middleware: ({logger, matcher = asyncMatcher}) => async (ctx, next) => {
    if (!ctx.element) {
      return next();
    }

    // TODO: allow custom errorComponents
    const errorComponents = {
      notFound: FourOhFour,
      fatal: Oops,
    };

    // ATTENTION: the plugin depends on the registration order
    const routes = ctx.element;

    try {
      const {redirectLocation, renderProps} = await matcher({
        routes,
        location: ctx.url,
      });

      // If all three parameters are undefined, this means that there
      // was no route found matching the given location.
      //
      // The provided router should handle the no-match cases
      // so this is merely a backup
      if (!redirectLocation && !renderProps) {
        const noMatchError = new Error(`${ctx.url} route not found`);
        noMatchError.statusCode = 404;
        handleError({
          err: noMatchError,
          ctx,
          logger,
          errorComponents,
        });
        return next();
      }

      if (redirectLocation) {
        // Don't globally redirect
        const relativePath =
          redirectLocation.pathname + redirectLocation.search;

        ctx.status = 302;
        ctx.redirect(relativePath);
        return next();
      }

      ctx.element = <RouterContext {...renderProps} />;
      return next();
    } catch (matchError) {
      matchError.statusCode = 500;
      handleError({err: matchError, ctx, logger, errorComponents});
      return next();
    }
  },
});

export {ReactRouterV3MatcherToken};
