import React from 'react';
import {Route, IndexRoute, Redirect, IndexRedirect} from 'react-router';
import FourOhFour from './not-found';
import AppContainer from '../containers/app-container';

export default (
  <Route component={AppContainer} path="/">
    <Route path="counter" component={CounterContainer} />
    <Route path="/counter" component={CounterContainer} />
    <Route path={getThing()} component={CounterContainer} />
    <Route path="test" component={Test}>
      <Route path="LOL" component={Other}/>
    </Route>
    <Route path="*" component={FourOhFour} statusCode={404} />
  </Route>
);
