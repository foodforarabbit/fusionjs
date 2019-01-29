// @flow
import React from 'react';
import {assetUrl} from 'fusion-core';
import {Helmet} from 'fusion-plugin-react-helmet-async';
import {Route, Switch, NotFound} from 'fusion-plugin-react-router';
import Welcome from './welcome.js';

const PageNotFound = () => (
  <NotFound>
    <div>404</div>
  </NotFound>
);

const faviconPath = assetUrl('../static/favicon.ico');

export const Root = () => (
  <div id="wrapper">
    <Helmet>
      <link rel="shortcut icon" type="image/x-icon" href={faviconPath} />
      <link rel="icon" type="image/x-icon" href={faviconPath} />
      <style>{`
html,body,#root,#wrapper{height:100%;}
html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0);}
body{margin:0;}
button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0;}
input::-webkit-inner-spin-button,input::-webkit-outer-spin-button,input::-webkit-search-cancel-button,input::-webkit-search-decoration,input::-webkit-search-results-button,input::-webkit-search-results-decoration{display:none;}
      `}</style>
    </Helmet>
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route component={PageNotFound} />
    </Switch>
  </div>
);
export default <Root />;
