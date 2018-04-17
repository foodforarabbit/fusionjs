import React from 'react';
import {IndexRoute, Redirect, Route} from '../index';

const App = props => <div>{props.children}</div>;
const Main = () => <div>Main</div>;
const Fancy = () => <div>Fancy</div>;
const Stuff = () => <div>Stuff</div>;

export default {
  normal: (
    <Route path="/" component={App}>
      <IndexRoute component={Main} />
      <Route path="fancy" component={Fancy} />
      <Route path="stuff" component={Stuff} />
    </Route>
  ),
  redirect: (
    <Route path="/" component={App}>
      <Redirect from="nowhere" to="somewhere" />
    </Route>
  ),
};
