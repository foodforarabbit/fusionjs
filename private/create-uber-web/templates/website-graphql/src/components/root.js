// @flow
import React from 'react';
import {assetUrl} from 'fusion-core';
import {Helmet} from 'fusion-plugin-react-helmet-async';
import {styled, BaseProvider, createTheme, lightThemePrimitives} from 'baseui';
import {DOMEventsTracker} from '@uber/fusion-plugin-web-analytics';
import App from './app';

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

const faviconPath = assetUrl('../static/favicon.ico');

const primaryFontFamily =
  'UberMoveText, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif';
const secondaryFontFamily =
  'UberMove, UberMoveText, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif';
const theme = createTheme(
  {...lightThemePrimitives, primaryFontFamily},
  {
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
    typography: {
      font1100: {
        fontFamily: secondaryFontFamily,
      },
    },
  }
);

const CaptureElement = styled('div', {
  height: '100%',
});

export const Root = () => (
  <DOMEventsTracker as={CaptureElement}>
    <div id="wrapper" data-tracking-name="root">
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
      <BaseProvider theme={theme}>
        <App />
      </BaseProvider>
    </div>
  </DOMEventsTracker>
);
export default <Root />;
