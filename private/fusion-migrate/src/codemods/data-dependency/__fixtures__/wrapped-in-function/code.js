import React from 'react';
import {Route, IndexRedirect} from 'react-router';
import AppContainer from '../containers/app-container';
import TripsContainer from '../containers/trips-container';

const thing = 'test';

export default function() {
  const routes = (
    <Route
      path="/trips-viewer"
      component={AppContainer}
      trackingId="Home"
      dataDependency="getUser">
      <IndexRedirect to="trips" />
      <Route
        path="trips"
        component={TripsContainer}
        trackingId="Trips"
        dataDependency="getTrips">
        <Route path=":tripUUID" component={TripContainer} trackingId="Trip" />
      </Route>
    </Route>
  );
}
