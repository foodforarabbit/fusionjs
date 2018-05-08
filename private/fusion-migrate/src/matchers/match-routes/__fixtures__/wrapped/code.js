import React from 'react';
import {Route, IndexRoute, IndexRedirect, Redirect} from 'react-router';
import FourOhFour from '@uber/react-four-oh-four';
import prefixUrl from '@uber/bedrock/prefix-url';
import {rpcIds} from '../rpc-constants';
import AppContainer from '../containers/app-container';
import LiveDashboardStatsContainer from '../livedashboard/containers/livedashboard-stats-container';
import RestaurantSummaryStatsContainer from '../livedashboard/containers/restaurant-summary-stats-container';
import MultiRegionContainer from '../livedashboard/containers/multiregion-container';

export default function getRoutes() {
  return (
    <Route
      path={prefixUrl('/')}
      component={AppContainer}
      trackingId="home"
      dataDependency={rpcIds.getTerritories}>
      <IndexRoute component={LiveDashboardStatsContainer} trackingId="index" />
      <IndexRedirect to="/livedashboard" />
      <Route
        path="/livedashboard/day/:date(\d{4}-\d{1,2}-\d{1,2})"
        component={RestaurantSummaryStatsContainer}
      />
      <Route
        path="/livedashboard/day/:date(today)"
        component={RestaurantSummaryStatsContainer}
      />
      <Redirect from="/livedashboard/day/*" to="/livedashboard/day/today" />
      <Route
        path="/livedashboard"
        component={LiveDashboardStatsContainer}
        trackingId="livedashboard"
      />

      <Route path="/multiregion" component={MultiRegionContainer} />

      <Route
        path="*"
        component={FourOhFour}
        trackingId="FourOhFour"
        statusCode={404}
      />
    </Route>
  );
}
