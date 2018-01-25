module.exports = ({source}) =>
  source.replace(
    `import App from 'fusion-react';
import Styletron from 'fusion-plugin-styletron-react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RouterPlugin from 'fusion-plugin-react-router';

import DefaultRoot from '../components/root';

Enzyme.configure({adapter: new Adapter()});

export default function start(options = {}) {
  const defaultRender = mount;
  const render = options.render || defaultRender;
  const app = new App(options.root || DefaultRoot, render);
  app.register(Styletron);
  app.plugin(RouterPlugin);

  return app;
}`,
    `import App from 'fusion-react';
import Styletron from 'fusion-plugin-styletron-react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Router from 'fusion-plugin-react-router';
import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events';

import DefaultRoot from '../components/root';

Enzyme.configure({adapter: new Adapter()});

export default function start(options = {}) {
  const defaultRender = mount;
  const render = options.render || defaultRender;
  const app = new App(options.root || DefaultRoot, render);
  app.register(Styletron);
  app.register(Router);
  app.register(UniversalEventsToken, UniversalEvents);

  return app;
}`
  );
