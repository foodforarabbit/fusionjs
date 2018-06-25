/* eslint-env browser */

import {HYDRATION_ID, INSTANCE_KEY} from './constants.js';

export function clientWrapper(render) {
  return (...args) => {
    // 1. Hydrate
    const hydrationElement = document.getElementById(HYDRATION_ID);
    const styletron = window[INSTANCE_KEY];

    if (styletron && hydrationElement) {
      try {
        const alreadyInjectedStyles = JSON.parse(
          hydrationElement.firstChild.data
        );
        for (let i = alreadyInjectedStyles.length - 1; i >= 0; i--) {
          styletron.markAsInjected(alreadyInjectedStyles[i]);
        }
      } catch (e) {
        // Hydration is technically optional
      }
    }

    // 2. Render after hydration
    return render(...args);
  };
}
