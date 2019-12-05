// @flow
import {withServices} from 'fusion-react';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

export const withBatchEvents = withServices({
  universalEvents: UniversalEventsToken,
});
