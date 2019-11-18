// @flow
import {withServices} from 'fusion-react';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

export const withUniversalEvents = withServices({
  universalEvents: UniversalEventsToken,
});
