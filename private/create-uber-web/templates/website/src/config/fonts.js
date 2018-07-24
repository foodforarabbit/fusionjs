// @flow
import {assetUrl} from 'fusion-core';
import {withFontLoading} from 'fusion-plugin-font-loader-react';

export const withBookFont = withFontLoading('Book');
export const withMediumFont = withFontLoading('Medium');
export const withNewsFont = withFontLoading('News');
export const withThinFont = withFontLoading('Thin');
export const withNarrowBookFont = withFontLoading('NarrowBook');
export const withNarrowMediumFont = withFontLoading('NarrowMedium');
export const withNarrowNewsFont = withFontLoading('NarrowNews');
export const withNarrowThinFont = withFontLoading('NarrowThin');

export default {
  preloadDepth: 1,
  fonts: {
    Book: {
      urls: {
        woff2: assetUrl('../static/fonts/Clan-Book.woff2'),
        woff: assetUrl('../static/fonts/Clan-Book.woff'),
      },
      fallback: {
        name: 'Helvetica',
      },
    },
    NarrowBook: {
      urls: {
        woff2: assetUrl('../static/fonts/Clan-Narrow-Book.woff2'),
        woff: assetUrl('../static/fonts/Clan-Narrow-Book.woff'),
      },
      fallback: {
        name: 'Helvetica',
      },
    },
    Medium: {
      urls: {
        woff2: assetUrl('../static/fonts/Clan-Medium.woff2'),
        woff: assetUrl('../static/fonts/Clan-Medium.woff'),
      },
      fallback: {
        name: 'Book',
      },
      styles: {
        fontWeight: 'bold',
      },
    },
    NarrowMedium: {
      urls: {
        woff2: assetUrl('../static/fonts/Clan-Narrow-Medium.woff2'),
        woff: assetUrl('../static/fonts/Clan-Narrow-Medium.woff'),
      },
      fallback: {
        name: 'NarrowBook',
      },
      styles: {
        fontWeight: 'bold',
      },
    },
    News: {
      urls: {
        woff2: assetUrl('../static/fonts/Clan-News.woff2'),
        woff: assetUrl('../static/fonts/Clan-News.woff'),
      },
      fallback: {
        name: 'Book',
        styles: {
          fontWeight: 'bold',
        },
      },
    },
    NarrowNews: {
      urls: {
        woff2: assetUrl('../static/fonts/Clan-Narrow-News.woff2'),
        woff: assetUrl('../static/fonts/Clan-Narrow-News.woff'),
      },
      fallback: {
        name: 'NarrowBook',
        styles: {
          fontWeight: 'bold',
        },
      },
    },
    Thin: {
      urls: {
        woff2: assetUrl('../static/fonts/Clan-Thin.woff2'),
        woff: assetUrl('../static/fonts/Clan-Thin.woff'),
      },
      fallback: {
        name: 'Book',
        styles: {
          fontWeight: '100',
        },
      },
    },
    NarrowThin: {
      urls: {
        woff2: assetUrl('../static/fonts/Clan-Narrow-Thin.woff2'),
        woff: assetUrl('../static/fonts/Clan-Narrow-Thin.woff'),
      },
      fallback: {
        name: 'NarrowBook',
        styles: {
          fontWeight: '100',
        },
      },
    },
  },
};
