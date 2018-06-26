import {SomeToken, SomePlugin} from 'some-plugin';
import ReduxPlugin, {ReduxToken} from 'fusion-plugin-react-redux';

function thing(app) {
  app.register(SomeToken, SomePlugin);
  if (__NODE__) {
    app.register(ReduxToken, ReduxPlugin);
  }
  return app;
}
