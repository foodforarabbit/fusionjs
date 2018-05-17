export const Root = () => (
  <Switch>
    <Route exact path="/" component={Welcome} />
    <Route component={PageNotFound} />
  </Switch>
);
