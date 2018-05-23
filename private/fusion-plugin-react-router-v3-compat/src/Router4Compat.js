import React from 'react';
import PropTypes from 'prop-types';
import {Switch} from 'fusion-plugin-react-router';
import {castArray} from './utils';
import {renderCompatRoutes, RoutePropType} from './Route4Compat';

import {BrowserHistoryCompat} from './BrowserHistoryCompat';
import {createRoutes} from './v3/RouteUtils';
import _isActive from './v3/isActive';
import {createLocation} from './v3/LocationUtils';

const createRouter4Compat = () => {
  const browserHistoryCompat = new BrowserHistoryCompat();

  class Router4Compat extends React.Component {
    constructor(props, context) {
      super(props, context);
      browserHistoryCompat.setHistory(
        context && context.router && context.router.history
      );
      this.state = {
        routes: [],
        params: {},
      };
    }
    getChildContext() {
      const {history} = this.context.router;
      return {
        router: {
          ...this.context.router,
          ...history,
          isActive: (location, indexOnly) => {
            const _location = createLocation(location);
            return _isActive(
              _location,
              indexOnly,
              history.location,
              this.state.routes,
              {} // TODO: this.state.params
            );
          },
        },
        routesCompat: this.state.routes,
        updateRoutes: this.updateRoutes,
      };
    }
    updateRoutes = updater => {
      this.setState(state => {
        return {routes: updater(state.routes)};
      });
    };
    render() {
      const {v3Routes, onError} = this.props;
      const routes = castArray(createRoutes(v3Routes));
      return (
        <div>
          <Switch>{renderCompatRoutes(routes, onError, [])}</Switch>
          {this.props.children}
        </div>
      );
    }
  }

  Router4Compat.contextTypes = {
    router: PropTypes.object,
  };

  Router4Compat.propTypes = {
    v3Routes: PropTypes.oneOfType([
      RoutePropType,
      PropTypes.arrayOf(RoutePropType),
    ]).isRequired,
    onError: PropTypes.func,
  };

  Router4Compat.defaultProps = {
    onError: () => null,
  };

  Router4Compat.childContextTypes = {
    router: PropTypes.object,
    routesCompat: PropTypes.arrayOf(RoutePropType),
    updateRoutes: PropTypes.func,
  };

  return {Router4Compat, browserHistoryCompat};
};

export {createRouter4Compat};
