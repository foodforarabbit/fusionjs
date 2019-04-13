// @flow
import {CookieDataTypes} from './index';
import type {CookieTypeType} from '../types';

const UberWebEventCookieType: CookieTypeType = {
  name: '_ua',
  options: {
    httpOnly: false,
  },
  data: {
    session_id: CookieDataTypes.UUID,
    session_time_ms: CookieDataTypes.TIME_STAMP,
  },
};

export default UberWebEventCookieType;
