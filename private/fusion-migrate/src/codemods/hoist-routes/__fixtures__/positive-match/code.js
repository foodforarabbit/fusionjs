import React from 'react';
import {Route, IndexRoute} from 'react-router';
import FourOhFour from './not-found';
import AppContainer from '../containers/app-container';
import TagsEditorContainer from '../containers/tags-editor-container';
import CounterContainer from '../containers/counter-container';
import ExampleErrorContainer from '../containers/example-error-container';

export default function getRoutes() {
  const test = 'hello';
  return (
    <Route component={AppContainer}>
      <IndexRoute component={TagsEditorContainer} />
      <Route path="counter" component={CounterContainer} />
      <Route path="example-error" component={ExampleErrorContainer} />
      <Route path="*" component={FourOhFour} statusCode={404} />
    </Route>
  );
}
