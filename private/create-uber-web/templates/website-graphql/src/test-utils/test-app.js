// @flow
import type FusionApp from 'fusion-core';
import {renderToStaticMarkup} from 'react-dom/server';
import type {Element} from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import getApp from '../main';
import {getDataFromTree} from 'react-apollo';
import addMocks from './add-mocks';

const serverRender = el =>
  getDataFromTree(el).then(() => renderToStaticMarkup(el));

const render = __NODE__ ? serverRender : el => Promise.resolve(mount(el));

Enzyme.configure({adapter: new Adapter()});

export default async function start(root?: Element<*>): Promise<FusionApp> {
  const app = await getApp(root, render);
  if (__NODE__) {
    addMocks(app);
  }
  return app;
}
