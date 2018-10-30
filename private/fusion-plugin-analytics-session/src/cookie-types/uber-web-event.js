// @flow
import {UUID, TIME_STAMP} from './index';

export default {
  name: '_ua',
  options: {maxAge: null, expires: null},
  data: {session_id: UUID, session_time_ms: TIME_STAMP},
};
