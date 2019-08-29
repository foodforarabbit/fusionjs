// @flow
import type FusionApp from 'fusion-core';
import {renderToStaticMarkup} from 'react-dom/server';
import type {Element} from 'react';
import {render} from '@testing-library/react';

import getApp from '../main';
import {getDataFromTree} from '@apollo/react-ssr';
import addMocks from './add-mocks';

const serverRender = el =>
  getDataFromTree(el).then(() => renderToStaticMarkup(el));

export default async function start(root?: Element<*>): Promise<FusionApp> {
  const app = await getApp(
    root,
    __NODE__ ? serverRender : el => Promise.resolve(render(el))
  );
  if (__NODE__) {
    addMocks(app);
  }
  return app;
}
