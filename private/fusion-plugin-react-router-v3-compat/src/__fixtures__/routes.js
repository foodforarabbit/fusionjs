import React from 'react';
import {
  IndexRouteV3,
  RedirectV3,
  RouteV3,
  browserHistoryCompat,
} from '../index';

const App = props => <div>{props.children}</div>;
const Main = () => <div>Main</div>;
const Fancy = () => <div>Fancy</div>;
const Stuff = () => <div>Stuff</div>;
const HistoryTest = () => (
  <div>browserHistoryCompat.push: {browserHistoryCompat.push.toString()}</div>
);

export default {
  normal: (
    <RouteV3 path="/" component={App}>
      <IndexRouteV3 component={Main} />
      <RouteV3 path="fancy" component={Fancy} />
      <RouteV3 path="stuff" component={Stuff} />
      <RouteV3 path="history-test" component={HistoryTest} />
    </RouteV3>
  ),
  redirect: (
    <RouteV3 path="/" component={App}>
      <RedirectV3 from="nowhere" to="somewhere" />
    </RouteV3>
  ),
};
