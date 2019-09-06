// @flow

import React from 'react';
import App, {FusionContext, useService} from 'fusion-react';
import Plugin, {Token} from '../../..';

function Root() {
  const ctx = React.useContext(FusionContext);
  const service = useService(Token).from(ctx);

  return (
    <div data-testid="serialized-value">{service.value}</div>
  );
}

export default () => {
  const app = new App(<Root />);
  app.register(Token, Plugin);
  return app;
};
