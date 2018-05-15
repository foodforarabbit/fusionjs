import React from 'react';
import {Route, IndexRoute, Redirect, IndexRedirect} from 'react-router';
import FourOhFour from './not-found';
import AppContainer from '../containers/app-container';
import TagsEditorContainer from '../containers/tags-editor-container';
import CounterContainer from '../containers/counter-container';
import ExampleErrorContainer from '../containers/example-error-container';

export default function getRoutes() {
  const test = 'hello';
  return (
    <Route component={AppContainer} path="prefix">
      <IndexRoute component={TagsEditorContainer} />
      <IndexRedirect to="counter" />
      <Redirect from="test" to="counter" />
      <Route path="counter" component={CounterContainer} />
      <Route path="prefix/test" component={CounterContainer} />
      <Route path="prefix" component={CounterContainer} />
      <Route path="example-error" component={ExampleErrorContainer} />
      <Route path="*" component={FourOhFour} statusCode={404} />
    </Route>
  );
}
