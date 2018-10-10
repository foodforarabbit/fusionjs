// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect, Switch, matchPath} from 'fusion-plugin-react-router';
import {AsyncComponent} from 'react-async-wrapper';

import {assignWith, mapValues} from './utils';

const createRouterState = ({match, location, history}) => ({
  match,
  location,
  history,
  ...location,
});

export const renderCompatRoutes = (routes, onError, routeStack = []) =>
  routes
    .map(route => {
      const {_redirect, to} = route;
      const {path, component, onEnter, exact} = route;

      if (_redirect) {
        return (
          <Route
            key={path || 0}
            path={path}
            exact={Boolean(exact)}
            render={() => <Redirect to={to} />}
          />
        );
      }
      if (!component && !onEnter) {
        return null;
      }
      return (
        <Route
          key={path || 0}
          path={path}
          exact={Boolean(exact)}
          // eslint-disable-next-line react/no-children-prop
          children={props => {
            if (component && !onEnter) {
              return (
                <Route4Compat
                  {...props}
                  route={route}
                  routeStack={routeStack}
                  onError={onError}
                />
              );
            }
            const asyncJobs = [];
            if (onEnter) {
              const {match, location, history} = props;
              const routeState = createRouterState({match, location, history});
              asyncJobs.push(
                () =>
                  new Promise((resolve, reject) => {
                    if (onEnter.length >= 3) {
                      onEnter(routeState, history.replace, err => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve();
                        }
                      });
                    } else {
                      onEnter(routeState, history.replace);
                      resolve();
                    }
                  })
              );
            }
            return (
              <AsyncComponent
                batch
                onError={onError}
                asyncJobs={asyncJobs}
                loadingComponent={() => null}
                reloadOnUpdate={false}
              >
                <Route4Compat
                  {...props}
                  route={route}
                  routeStack={routeStack}
                  onError={onError}
                />
              </AsyncComponent>
            );
          }}
        />
      );
    })
    .filter(v => v);

export class Route4Compat extends React.Component {
  componentDidMount() {
    const {match, route, routeStack} = this.props;
    if (match && match.isExact) {
      this.context.updateRoutes(() => [...routeStack, route]);
    }
  }
  componentWillUnmount() {
    const {route} = this.props;
    this.context.updateRoutes(routes =>
      routes.filter(r => r.path !== route.path)
    );
  }
  render() {
    const {
      route,
      routeStack,
      match,
      location,
      history,
      onError,
      ...rest
    } = this.props;
    const {component: Comp} = route;
    if (!Comp) {
      return null;
    }

    const namedComponentsRoutes = {};
    let {indexRedirect, indexRoute, childRoutes} = route;
    let routes = [];
    if (indexRedirect) {
      routes.push(indexRedirect);
    }
    if (indexRoute) {
      routes.push(indexRoute);
    }
    if (childRoutes) {
      for (let i = 0; i < childRoutes.length; ++i) {
        const childRoute = childRoutes[i];
        const {components: childComponents} = childRoute;

        if (childComponents) {
          assignWith(
            namedComponentsRoutes,
            childComponents,
            (objValue, srcValue) => {
              const namedComponentRoute = {
                path: childRoute.path,
                component: srcValue,
              };
              if (!objValue) {
                return [namedComponentRoute];
              } else {
                objValue.push(namedComponentRoute);
                return objValue;
              }
            }
          );
        }
      }
    }
    routes = routes.concat(childRoutes || []);

    const namedComponentsChildren = mapValues(
      namedComponentsRoutes,
      namedRoutes => {
        if (indexRedirect) {
          namedRoutes.push(indexRedirect);
        }

        const namedRoutesElements = namedRoutes.map(nr =>
          renderCompatRoutes([nr], onError, [...routeStack, route])
        );
        if (namedRoutes.length === 1) {
          return namedRoutesElements[0];
        } else {
          return <Switch>{namedRoutesElements}</Switch>;
        }
      }
    );

    const validRoutes = routes.filter(r =>
      Boolean(matchPath(location.pathname, r, match))
    );

    const CompChildren =
      validRoutes.length > 0
        ? renderCompatRoutes([validRoutes[0]], onError, [...routeStack, route])
        : null;

    return (
      <Comp
        {...rest}
        router={history}
        params={match.params}
        location={location}
        routes={this.context.routesCompat}
        {...namedComponentsChildren}
      >
        {CompChildren}
      </Comp>
    );
  }
}

export const RoutePropType = PropTypes.shape({
  path: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  indexRoute: PropTypes.object,
  childRoutes: PropTypes.arrayOf(PropTypes.object),
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  sensitive: PropTypes.bool,
});

Route4Compat.contextTypes = {
  router: PropTypes.object,
  routesCompat: PropTypes.arrayOf(RoutePropType),
  updateRoutes: PropTypes.func,
};

Route4Compat.propTypes = {
  route: RoutePropType,
  routeStack: PropTypes.arrayOf(RoutePropType),
  onError: PropTypes.func,
  history: PropTypes.object.isRequired,
  location: PropTypes.object,
};

Route4Compat.defaultProps = {
  route: {},
  routeStack: [],
  onError: () => null,
};
