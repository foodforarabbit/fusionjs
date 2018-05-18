import React from 'react';
import {Route, IndexRedirect} from 'react-router';
import App from '../app';
import Trips from '../trips';
import rpcIds from './rpcids';

const thing = 'test';

export default function() {
  const routes = (
    <Route path="/trips-viewer" component={App}>
      <Route path="/user" component={User} dataDependency="getUser" />
      <Route
        path="trips"
        component={Trips}
        dataDependency={['getTrips', 'getUser']}
      />
      <Route path="/trip" component={Trip} dataDependency="getTrips" />
    </Route>
  );
}
