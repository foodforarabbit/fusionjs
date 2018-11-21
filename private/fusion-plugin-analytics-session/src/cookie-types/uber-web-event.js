// @flow
import {UUID, TIME_STAMP} from './index';

import type {CookieTypeType} from '../types';

const UberWebEventCookieType: CookieTypeType = {
  name: '_ua',
  options: {
    httpOnly: false,
  },
  data: {
    session_id: UUID,
    session_time_ms: TIME_STAMP,
  },
};

export default UberWebEventCookieType;
