import React from 'react';
import {Route, IndexRoute, Redirect, IndexRedirect} from 'react-router';
import FourOhFour from './not-found';
import AppContainer from '../containers/app-container';

export default (
  <Route component={AppContainer} path="prefix">
    <IndexRedirect to='/test' />
  </Route>
);
