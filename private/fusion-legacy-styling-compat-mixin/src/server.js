import styletron from 'styletron-legacy';
import safeString from 'safe-string';
import CleanCSS from 'clean-css';

import {HYDRATION_ID} from './constants.js';

export function serverWrapper(render) {
  return (...args) => {
    // 1. First prepare/reset singleton
    styletron.reset();
    styletron.startBuffering();

    // 2. Render synchronously
    const html = render(...args);

    // 3. Then cleanup and flush singleton
    const css = styletron.flushBuffer();
    const injectedKeys = styletron.getInjectedKeys();

    if (css) {
      const minified = new CleanCSS({advanced: false}).minify(css).styles;
      const stylesHtml = `<style>${minified}</style>`;
      const keysJson = safeString(JSON.stringify(injectedKeys));
      const hydrationHtml = `<script id="${HYDRATION_ID}" type="application/json">${keysJson}</script>`;

      return `${stylesHtml}${html}${hydrationHtml}`;
    }

    return html;
  };
}
