// @flow
import React from 'react';
import {Route, Switch, NotFound} from 'fusion-plugin-react-router';

import Welcome from './welcome.js';

const PageNotFound = () => (
  <NotFound>
    <div>404</div>
  </NotFound>
);

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route component={PageNotFound} />
    </Switch>
  );
}
