import React from 'react';
import {Route, IndexRoute} from 'react-router';
import FourOhFour from './not-found';
import AppContainer from '../containers/app-container';

export default (
  <Route component={AppContainer} path="prefix">
    <IndexRoute component={Test} />
    <Route path="*" component={FourOhFour} statusCode={404} />
  </Route>
);
