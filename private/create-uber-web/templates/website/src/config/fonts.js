// @flow

/* eslint-disable */

/*
Purpose
1) Data for @font-face generation
2) Used to build an in-memory font fallback tree at runtime
3) Fallbacks at and above the specified preloadDepth will be preloaded/prefetched on page load
4) Remaining fonts will lazily load, text will temporarily use fallback font until the font has loaded
*/

import { assetUrl } from 'fusion-core';
import { withFontLoading } from 'fusion-plugin-font-loader-react';
import type { AtomicFontsObjectType, StyledFontsObjectType } from 'fusion-plugin-font-loader-react';

export const withMoveRegular = withFontLoading('UberMove-Regular');
export const withMoveLight = withFontLoading('UberMove-Light');
export const withMoveMedium = withFontLoading('UberMove-Medium');
export const withMoveBold = withFontLoading('UberMove-Bold');
export const withMoveTextRegular = withFontLoading('UberMoveText-Regular');
export const withMoveTextLight = withFontLoading('UberMoveText-Light');
export const withMoveTextMedium = withFontLoading('UberMoveText-Medium');
export const withMoveTextBold = withFontLoading('UberMoveText-Bold');

export default function getFontConfig(withStyleOverloads?: boolean) {
  return {
    withStyleOverloads,
    preloadDepth: 0,
    fonts: withStyleOverloads ? styledFonts : atomicFonts,
  }
}

const atomicFonts: AtomicFontsObjectType = {
  'UberMove-Regular': {
    urls: {
      woff2: assetUrl('../static/fonts/UberMove-Regular.woff2'),
      woff: assetUrl('../static/fonts/UberMove-Regular.woff') },

    fallback: {
      name: 'Arial'
    }
  },

  'UberMove-Light': {
    urls: {
      woff2: assetUrl('../static/fonts/UberMove-Light.woff2'),
      woff: assetUrl('../static/fonts/UberMove-Light.woff') },

    fallback: {
      name: 'UberMove-Regular',
      styles: {
        fontWeight: '200'
      }
    }
  },

  'UberMove-Medium': {
    urls: {
      woff2: assetUrl('../static/fonts/UberMove-Medium.woff2'),
      woff: assetUrl('../static/fonts/UberMove-Medium.woff') },

    fallback: {
      name: 'UberMove-Regular',
      styles: {
        fontWeight: '500'
      }
    }
  },

  'UberMove-Bold': {
    urls: {
      woff2: assetUrl('../static/fonts/UberMove-Bold.woff2'),
      woff: assetUrl('../static/fonts/UberMove-Bold.woff') },

    fallback: {
      name: 'UberMove-Regular',
      styles: {
        fontWeight: '600'
      }
    }
  },

  'UberMoveText-Regular': {
    urls: {
      woff2: assetUrl('../static/fonts/UberMoveText-Regular.woff2'),
      woff: assetUrl('../static/fonts/UberMoveText-Regular.woff') },

    fallback: {
      name: 'Arial'
    }
  },

  'UberMoveText-Light': {
    urls: {
      woff2: assetUrl('../static/fonts/UberMoveText-Light.woff2'),
      woff: assetUrl('../static/fonts/UberMoveText-Light.woff') },

    fallback: {
      name: 'UberMoveText-Regular',
      styles: {
        fontWeight: '200'
      }
    }
  },

  'UberMoveText-Medium': {
    urls: {
      woff2: assetUrl('../static/fonts/UberMoveText-Medium.woff2'),
      woff: assetUrl('../static/fonts/UberMoveText-Medium.woff') },

    fallback: {
      name: 'UberMoveText-Regular',
      styles: {
        fontWeight: '500'
      }
    }
  },

  'UberMoveText-Bold': {
    urls: {
      woff2: assetUrl('../static/fonts/UberMoveText-Bold.woff2'),
      woff: assetUrl('../static/fonts/UberMoveText-Bold.woff') },

    fallback: {
      name: 'UberMoveText-Regular',
      styles: {
        fontWeight: '600'
      }
    }
  },
};

const styledFonts: StyledFontsObjectType = {
  'UberMove': [
    {
      urls: {
        woff2: assetUrl('../static/fonts/UberMove-Regular.woff2'),
        woff: assetUrl('../static/fonts/UberMove-Regular.woff') },

      styles: {
        fontWeight: 400,
      }
    },
    {
      urls: {
        woff2: assetUrl('../static/fonts/UberMove-Light.woff2'),
        woff: assetUrl('../static/fonts/UberMove-Light.woff') },

      styles: {
        fontWeight: 200,
      }
    },
    {
      urls: {
        woff2: assetUrl('../static/fonts/UberMove-Medium.woff2'),
        woff: assetUrl('../static/fonts/UberMove-Medium.woff') },

      styles: {
        fontWeight: 500,
      }
    },
    {
      urls: {
        woff2: assetUrl('../static/fonts/UberMove-Bold.woff2'),
        woff: assetUrl('../static/fonts/UberMove-Bold.woff') },

      styles: {
        fontWeight: 600,
      }
    },
  ],

  'UberMoveText': [
    {
      urls: {
        woff2: assetUrl('../static/fonts/UberMoveText-Regular.woff2'),
        woff: assetUrl('../static/fonts/UberMoveText-Regular.woff') },

      styles: {
        fontWeight: 400,
      }
    },
    {
      urls: {
        woff2: assetUrl('../static/fonts/UberMoveText-Light.woff2'),
        woff: assetUrl('../static/fonts/UberMoveText-Light.woff') },

      styles: {
        fontWeight: 200,
      }
    },
    {
      urls: {
        woff2: assetUrl('../static/fonts/UberMoveText-Medium.woff2'),
        woff: assetUrl('../static/fonts/UberMoveText-Medium.woff') },

      styles: {
        fontWeight: 500,
      }
    },
    {
      urls: {
        woff2: assetUrl('../static/fonts/UberMoveText-Bold.woff2'),
        woff: assetUrl('../static/fonts/UberMoveText-Bold.woff') },

      styles: {
        fontWeight: 600,
      }
    },
  ],
};