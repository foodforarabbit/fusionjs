// @flow
import React from 'react';
import {assetUrl} from 'fusion-core';
import {Helmet} from 'fusion-plugin-react-helmet-async';
import {Route, Switch, NotFound} from 'fusion-plugin-react-router';
import {ThemeProvider, createTheme, lightThemePrimitives} from 'baseui';
import {
  AlertFilled,
  ArrowLeftFilled,
  ArrowRightFilled,
  ArrowDownFilled,
  ArrowUpFilled,
  CheckmarkFilled,
  ChevronLeftSmallFilled,
  ChevronRightSmallFilled,
  ChevronDownSmallFilled,
  ChevronUpSmallFilled,
  CircleXFilled,
  FilterFilled,
  PlusSmallFilled,
  SearchFilled,
  ThreeDotsHorizontalFilled,
  ThreeLinesFilled,
  UploadFilled,
  XSmallFilled,
} from '@uber/icons';
import Welcome from './welcome.js';
import User from './user/user';

const PageNotFound = () => (
  <NotFound>
    <div>404</div>
  </NotFound>
);

const faviconPath = assetUrl('../static/favicon.ico');

const primaryFontFamily =
  'UberMoveText, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif';

const theme = createTheme({
    ...lightThemePrimitives,
    primaryFontFamily,
  }, {
  icons: {
    Alert: AlertFilled,
    ArrowLeft: ArrowLeftFilled,
    ArrowRight: ArrowRightFilled,
    ArrowUp: ArrowUpFilled,
    ArrowDown: ArrowDownFilled,
    Check: CheckmarkFilled,
    ChevronLeft: ChevronLeftSmallFilled,
    ChevronRight: ChevronRightSmallFilled,
    Delete: XSmallFilled,
    DeleteAlt: CircleXFilled,
    Filter: FilterFilled,
    Menu: ThreeLinesFilled,
    Overflow: ThreeDotsHorizontalFilled,
    Plus: PlusSmallFilled,
    Search: SearchFilled,
    TriangleLeft: ChevronLeftSmallFilled,
    TriangleRight: ChevronRightSmallFilled,
    TriangleDown: ChevronDownSmallFilled,
    TriangleUp: ChevronUpSmallFilled,
    Upload: UploadFilled,
  },
});

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
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/user" component={User} />
        <Route component={PageNotFound} />
      </Switch>
    </ThemeProvider>
  </div>
);
export default <Root />;
