import React from 'react';
import {Route, IndexRedirect} from 'react-router';
import App from '../app';
import Trips from '../trips';
import rpcIds from './rpcids';

const thing = 'test';

export default function() {
  const routes = (
    <Route path="/trips-viewer" component={App} dataDependency="getUser">
      <IndexRedirect to="trips" />
      <Route path="trips" component={Trips} dataDependency="getTrips">
        <Route path=":tripUUID" component={Trip} dataDependency="getTrips" />
      </Route>
      <Route path="test" component={Test} dataDependency={rpcIds.test} />
      <Route path="other" component={Test} dataDependency={rpcIds.test} />
    </Route>
  );
}
