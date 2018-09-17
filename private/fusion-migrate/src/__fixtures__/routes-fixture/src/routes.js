import {Route, IndexRoute, IndexRedirect, Redirect} from 'react-router';

export default function getRoutes() {
  return (
    <Route path='/' component={AppContainer} trackingId="app" >
      <IndexRoute component={HomeContainer} trackingId="home" dataDependency={[rpcIds.getA, rpcIds.getB]} />
      <Route path="/a" component={A} trackingId="a" />
      <Route path="/b" component={B} trackingId="b">
        <IndexRedirect to="/c" />
        <Route path="/c" component={C} trackingId="c" dataDependency="A"/>
        <Route path="/e" component={E} trackingId="E" dataDependency="E"/>
        <Redirect from="/d" to="/c" />
      </Route>
    </Route>
  );
}
